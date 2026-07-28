resource "azurerm_static_web_app" "app" {
  name                = local.names.static_web_app
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  sku_tier            = "Standard"
  sku_size            = "Standard"
  tags                = local.tags
}

locals {
  subdomain = {
    "dev" = var.branch_name == "main" ? "dev" : "dev-${var.branch_name}"
    "prod" = var.branch_name == "main" ? "app" : "prod-${var.branch_name}"
  }
  fqdn = "${local.subdomain[var.environment]}.${var.dns_zone_name}"
}

resource "azurerm_static_web_app_function_app_registration" "example" {
  static_web_app_id = azurerm_static_web_app.app.id
  function_app_id   = azurerm_linux_function_app.this.id
}

resource "cloudflare_dns_record" "this" {
  zone_id = var.cloudflare_zone_id
  name    = local.fqdn
  type    = "CNAME"
  content = azurerm_static_web_app.app.default_host_name
  ttl     = 300
  # cname-delegation validation requires Azure to see the static web app host,
  # so this record must stay DNS-only rather than proxied through Cloudflare
  proxied = false
  comment = "terraform: ${var.environment}/${var.branch_name}"
}

# Azure validates the cname the moment the custom domain is created, which a
# freshly created record loses to. Waiting on the record actually resolving
# beats guessing at a fixed delay, and matters because the zone's negative
# cache ttl is 1800s: if azure asks too early it can cache the miss for half
# an hour. Re-runs whenever the subdomain or its target changes.
resource "null_resource" "dns_propagated" {
  triggers = {
    fqdn   = local.fqdn
    target = cloudflare_dns_record.this.content
  }

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command     = <<-EOT
      set -e

      if ! command -v dig > /dev/null; then
        echo "dig is required to check dns propagation (install bind-utils/dnsutils)" >&2
        exit 1
      fi

      fqdn="${local.fqdn}"
      expected="${cloudflare_dns_record.this.content}"

      echo "waiting for $fqdn to resolve to $expected"
      for attempt in $(seq 1 60); do
        actual=$(dig +short @8.8.8.8 "$fqdn" CNAME | head -1 | sed 's/\.$//')
        if [ "$actual" = "$expected" ]; then
          echo "resolved after $attempt attempt(s)"
          exit 0
        fi
        sleep 5
      done

      echo "timed out after 5m waiting for $fqdn to resolve to $expected" >&2
      exit 1
    EOT
  }
}

resource "azurerm_static_web_app_custom_domain" "this" {
  static_web_app_id = azurerm_static_web_app.app.id
  domain_name       = local.fqdn
  validation_type   = "cname-delegation"

  depends_on = [null_resource.dns_propagated]
}
