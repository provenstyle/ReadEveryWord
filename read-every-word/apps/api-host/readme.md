# api-host

Azure Function Host for `api`

## Initial Steps for Running locally
```
# Start at the mono repo root
nx prune api-host
cd apps/api-host/dist
npm ci --omit=dev
cd ../
func start --port 7074 --typescript

```