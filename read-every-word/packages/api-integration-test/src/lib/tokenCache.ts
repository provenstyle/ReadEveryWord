import NodeCache from 'node-cache';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Hybrid caching strategy:
// 1. In-memory cache for performance within the same process
// 2. File-based cache for persistence across test runs (local and CI)
const inMemoryCache: NodeCache = new NodeCache({ stdTTL: 60 * 60 * 12, checkperiod: 0 })
const CACHE_KEY = 'auth0_m2m_token'

// Get cache file path - uses .cache directory in the package root
const currentFileUrl = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFileUrl)
const cacheDir = join(currentDir, '../../.cache')
const cacheFilePath = join(cacheDir, 'auth0-m2m-token.json')

interface TokenCache {
  token: string
  expiresAt: number // Unix timestamp in seconds
}

/**
 * Reads token from persistent file cache if it exists and is still valid
 */
function readFileCache(): string | null {
  try {
    if (!existsSync(cacheFilePath)) {
      return null
    }

    const cacheContent = readFileSync(cacheFilePath, 'utf-8')
    const cache: TokenCache = JSON.parse(cacheContent)

    // Check if token is still valid (with 5-minute buffer)
    const currentTime = Math.floor(Date.now() / 1000)
    const bufferSeconds = 5 * 60 // 5 minutes
    if (cache.expiresAt > currentTime + bufferSeconds) {
      return cache.token
    }

    // Token expired, return null to trigger refresh
    return null
  } catch {
    // If file read fails, treat as cache miss
    return null
  }
}

/**
 * Writes token to persistent file cache
 */
function writeFileCache(token: string, expiresAt: number): void {
  try {
    // Ensure cache directory exists
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true })
    }

    const cache: TokenCache = {
      token,
      expiresAt
    }

    writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8')
  } catch (error) {
    // If file write fails, log but don't throw - in-memory cache will still work
    console.warn('Failed to write token cache file:', error)
  }
}

/**
 * Gets the expiration timestamp from a JWT token
 */
function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null
    return decoded?.exp ?? null
  } catch {
    return null
  }
}

/**
 * Gets an Auth0 machine-to-machine token, using a hybrid caching strategy:
 * - In-memory cache for fast access within the same process
 * - File-based cache for persistence across test runs (local and CI)
 * 
 * Auth0 requires m2m tokens to be cached and reused until expired.
 * 
 * @returns Promise resolving to the access token
 * @throws Error if Auth0 credentials are missing or token fetch fails
 */
export async function withToken(): Promise<string> {
  // 1. Check in-memory cache first (fastest)
  const inMemoryToken = inMemoryCache.get<string>(CACHE_KEY)
  if (inMemoryToken) {
    return inMemoryToken
  }

  // 2. Check file cache (persists across processes)
  const fileCachedToken = readFileCache()
  if (fileCachedToken) {
    // Also populate in-memory cache for faster subsequent access
    const expiration = getTokenExpiration(fileCachedToken)
    if (expiration) {
      const currentTime = Math.floor(Date.now() / 1000)
      const ttl = Math.max(0, expiration - currentTime - 5 * 60) // 5 min buffer
      if (ttl > 0) {
        inMemoryCache.set(CACHE_KEY, fileCachedToken, ttl)
      }
    }
    return fileCachedToken
  }

  // 3. Fetch new token from Auth0
  const auth0Domain = process.env.AUTH0_DOMAIN || 'dev-l8vwbect7gmio0y3.us.auth0.com'
  const clientId = process.env.AUTH0_CLIENT_ID
  const clientSecret = process.env.AUTH0_CLIENT_SECRET

  if (!auth0Domain || !clientId || !clientSecret) {
    throw new Error('AUTH0_DOMAIN, AUTH0_CLIENT_ID and AUTH0_CLIENT_SECRET environment variables are required')
  }

  const response = await fetch(`https://${auth0Domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      audience: process.env.AUTH0_AUDIENCE || process.env.OPEN_ID_AUDIENCE
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch Auth0 token: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json() as { access_token: string; expires_in?: number }
  const accessToken = data.access_token

  if (!accessToken) {
    throw new Error('No access_token in Auth0 response')
  }

  // 4. Cache the new token in both in-memory and file cache
  const expiration = getTokenExpiration(accessToken)
  let expiresAt: number

  if (expiration) {
    expiresAt = expiration
  } else if (data.expires_in) {
    // Fallback to expires_in from response
    expiresAt = Math.floor(Date.now() / 1000) + data.expires_in
  } else {
    // Default to 12 hours if we can't determine expiration
    expiresAt = Math.floor(Date.now() / 1000) + (60 * 60 * 12)
  }

  // Write to file cache (persistent)
  writeFileCache(accessToken, expiresAt)

  // Write to in-memory cache (fast access)
  const currentTime = Math.floor(Date.now() / 1000)
  const ttl = Math.max(0, expiresAt - currentTime - 5 * 60) // 5 min buffer
  if (ttl > 0) {
    inMemoryCache.set(CACHE_KEY, accessToken, ttl)
  } else {
    // If already expired, still cache for a short time as fallback
    inMemoryCache.set(CACHE_KEY, accessToken, 60)
  }

  return accessToken
}

