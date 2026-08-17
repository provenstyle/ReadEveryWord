import { app } from '@azure/functions'

// The y1 consumption plan scales to zero, so prod drives a timer to keep an
// instance alive.
//
// This deliberately goes out over http rather than invoking the handler in
// process. A timer firing keeps an instance alive but never touches the http
// path - the function adapter, trpc's resolveResponse, header parsing,
// serialization - which is the path callers actually hit, and the one the
// consumption plan's http scale controller watches.
//
// KEEP_WARM is read straight from the environment rather than through
// fromEnv(), whose list is a hard gate that throws at module load. A missing
// flag should mean off, not a dead function app.
const keepWarm = process.env.KEEP_WARM?.toLowerCase() === 'true'

if (keepWarm) {
    console.log('Keep warm is enabled.')

    app.timer('keep_warm_timer', {
        schedule: '0 * * * * *',
        handler: async (_timer, context) => {
            // Azure sets WEBSITE_HOSTNAME to the app's default hostname; core
            // tools sets it to localhost:<port>, which needs the http scheme.
            const base = process.env.KEEP_WARM_URL
                ?? `https://${process.env.WEBSITE_HOSTNAME}`

            // healthCheck.get is a public query, so no token and, because the
            // route is anonymous, no function key.
            const url = `${base}/api/trpc/healthCheck.get?input=%7B%7D`

            try {
                const response = await fetch(url)
                context.log(`Keep warm ${url} responded ${response.status}`)
            } catch (error) {
                // Never rethrow. A failing keep warm should not show up as a
                // stream of failed invocations telling us nothing the health
                // check itself would not.
                context.error(`Keep warm ${url} failed`, error)
            }
        }
    })
}
