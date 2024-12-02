output "names" {
  value = local.names
  description = "generated resource names"
}

output "function_app_endpoint" {
  description = "Endpoint for the api"
  value       = azurerm_linux_function_app.this.default_hostname
}

output "function_app_key" {
  description = "Access key for the api"
  sensitive   = true
  value       = data.azurerm_function_app_host_keys.api.default_function_key
}
