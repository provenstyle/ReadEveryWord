# The audience is a historical name: it was the bff's auth0 api identifier.
# Auth0 api identifiers are immutable, so renaming means creating a new api,
# reauthorizing the spa and 401ing every cached token until it refreshes. It
# now identifies the nx api.
open_id_jwks_uri  = "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/.well-known/jwks.json"
open_id_audience  = "read-every-word-bff-dev"
open_id_domain    = "dev-lr8vwbeyc7gmi0w2.us.auth0.com"
open_id_client_id = "EklZm4b41JEMQtssQciDgZtHtNzE2pBw"
open_id_issuer    = "https://dev-lr8vwbeyc7gmi0w2.us.auth0.com/"
keep_warm         = "false"
