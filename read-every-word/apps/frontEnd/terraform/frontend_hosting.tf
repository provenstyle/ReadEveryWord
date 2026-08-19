locals {
  subdomain = {
    "dev"  = var.branch_name == "main" ? "dev" : "dev-${var.branch_name}"
    "prod" = var.branch_name == "main" ? "app" : "prod-${var.branch_name}"
  }
  fqdn = "${local.subdomain[var.environment]}.${var.dns_zone_name}"
}

resource "azurerm_storage_account" "frontend" {
  name                = local.names.frontend_storage
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  account_tier        = "Standard"
  # static_website requires StorageV2 or BlockBlobStorage
  account_kind             = "StorageV2"
  account_replication_type = var.storage_account_replication_type
  tags                     = local.tags

  static_website {
    index_document = "index.html"
    # Spa fallback. Storage serves this for unknown paths but keeps the 404
    # status, so edge_worker.js rewrites the status to 200.
    error_404_document = "index.html"
  }
}

# Proxied, unlike the static web app record it replaces: cloudflare terminates
# tls and picks the origin, so there is no azure custom domain to validate and
# no dns propagation race to wait out.
resource "cloudflare_dns_record" "this" {
  zone_id = var.cloudflare_zone_id
  name    = local.fqdn
  type    = "CNAME"
  content = azurerm_storage_account.frontend.primary_web_host
  # cloudflare rejects any other ttl on a proxied record
  ttl     = 1
  proxied = true
  comment = "terraform: ${var.environment}/${var.branch_name}"
}

# Scoped to this environment's hostname so dev, prod and every branch stack
# own separate routes in the shared zone.
resource "cloudflare_workers_script" "edge" {
  account_id         = var.cloudflare_account_id
  script_name        = replace(local.fqdn, ".", "-")
  content            = file("${path.module}/edge_worker.js")
  main_module        = "edge_worker.js"
  compatibility_date = "2026-08-01"

  bindings = [
    {
      type = "plain_text"
      name = "WEB_HOST"
      text = azurerm_storage_account.frontend.primary_web_host
    },
    # The api function app, which the bff used to sit in front of.
    # function_app_endpoint is a bare default_hostname, no scheme.
    #
    # Wrapped in try() so this stack can be destroyed after the api stack has
    # already been destroyed
    {
      type = "plain_text"
      name = "API_HOST"
      text = try(data.terraform_remote_state.api.outputs.function_app_endpoint, "MISSING-FUNCTION-APP-ENDPOINT")
    },
  ]
}

resource "cloudflare_workers_route" "edge" {
  zone_id = var.cloudflare_zone_id
  pattern = "${local.fqdn}/*"
  script  = cloudflare_workers_script.edge.script_name
}
