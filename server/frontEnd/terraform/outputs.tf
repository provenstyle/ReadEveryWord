output "names" {
  value = local.names
  description = "generated resource names"
}

output "domain_name" {
  value = azurerm_static_web_app_custom_domain.this.domain_name
}

# Lets swa deploy authenticate with the app directly instead of going through
# entra, which the cli's credential chain keeps resolving to the wrong tenant
output "static_web_app_api_key" {
  description = "Deployment token for the static web app"
  sensitive   = true
  value       = azurerm_static_web_app.app.api_key
}