output "names" {
  value       = local.names
  description = "generated resource names"
}

output "domain_name" {
  value = local.fqdn
}

# Lets the publish script upload to $web directly instead of going through
# entra, which the az credential chain keeps resolving to the wrong tenant
output "frontend_storage_key" {
  description = "Deployment key for the frontend static website"
  sensitive   = true
  value       = azurerm_storage_account.frontend.primary_access_key
}
