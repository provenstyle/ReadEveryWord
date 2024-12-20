# Read Every Word

## Developers

npm run dev

### serving over https
swa seems to have a bug when using --ssl.  You can use --ssl and  also use the `appDevserverUrl` proxy. However, removing the proxy and serving the built files from the dist folder works.

    npx swa start --host 0.0.0.0 --ssl

Using this you can reach the app from outside the computer from the network at the computer ip address

    https://192.168.?.?:4280

### custom dev certificate

  openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
