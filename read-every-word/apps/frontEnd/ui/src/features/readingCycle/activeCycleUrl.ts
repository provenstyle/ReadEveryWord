import type { LocationQuery, LocationQueryRaw } from 'vue-router'

/**
 * Which cycle the ui is reading against lives in the url.
 *
 * It is still ui state rather than persisted cycle state, but putting it in the
 * url means a refresh stays where the user was instead of snapping back to the
 * default. A bare /read carries no key and therefore starts on the default,
 * which is what a fresh visit should do.
 *
 * This lives in its own module because a <script setup> block cannot contain
 * runtime ES module exports, only type ones.
 */
export const CYCLE_QUERY_KEY = 'cycle'

export const cycleIdFromQuery = (query: LocationQuery): string | undefined => {
  const value = query[CYCLE_QUERY_KEY]
  return (typeof value === 'string' && value.length > 0) ? value : undefined
}

export const queryForCycle = (id: string): LocationQueryRaw => ({ [CYCLE_QUERY_KEY]: id })
