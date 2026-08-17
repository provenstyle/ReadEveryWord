// Fans the hostname out to the two azure origins that used to sit behind the
// static web app. Both azure storage and app service route by Host, and the
// incoming request carries the public hostname that neither of them answers
// to. Rewriting url.hostname is what redirects the fetch and sets the SNI;
// cloudflare's own host header override is an enterprise-only feature.

// Mutates url, which the spa fallback below relies on to stay on the storage
// origin.
function proxyTo (host, url, request) {
  url.hostname = host
  const proxied = new Request(url, request)
  proxied.headers.set('Host', host)
  return proxied
}

export default {
  async fetch (request, env) {
    const url = new URL(request.url)

    // /api/* goes to the function app untouched. The two /api prefixes line
    // up by luck rather than design: this is the path the browser calls, and
    // azure functions serves under its own default route prefix of api, so
    // /api/trpc/x maps straight onto the trpc/{*path} catch all. Setting
    // routePrefix in host.json would break that and this would have to strip.
    if (url.pathname.startsWith('/api/')) {
      return fetch(proxyTo(env.API_HOST, url, request))
    }

    const response = await fetch(proxyTo(env.WEB_HOST, url, request))

    // Storage's error_404_document serves the spa shell but keeps the 404
    // status, which breaks deep links for anything checking response.ok.
    if (response.status === 404) {
      url.pathname = '/index.html'
      const shell = await fetch(url)
      return new Response(shell.body, { status: 200, headers: shell.headers })
    }

    return response
  }
}
