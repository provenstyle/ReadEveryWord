# Developer

## Running against local api service
```
# fetch app settings from the server for the function app
func azure functionapp fetch-app-settings $FUNCTION_APP_NAME --no-encrypt
func settings decrypt

# update local.settings.json and then restart the server
  "http": true,
  "BASE_URL": "127.0.0.1:7777/api",
```