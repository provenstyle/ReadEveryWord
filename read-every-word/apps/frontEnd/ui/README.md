# Read Every Word

## Developers

    npm run dev

That is the plain vite dev server on port 3000. `/api` is proxied to
`http://localhost:7778`, so start the bff alongside it:

    cd ../bff/app && npm start

In the deployed environments cloudflare's worker does the same split, which is
why the app can just call `window.location.origin`.

### serving over the network

    npm run dev -- --host 0.0.0.0

Then reach the app from another machine at the computer's ip address

    http://192.168.?.?:3000

### custom dev certificate

For https, point `server.https` in `vite.config.mts` at a self signed pair

  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
