output "names" {
  value = local.names
  description = "generated resource names"
}

output "domain_name" {
  value = azurerm_static_web_app_custom_domain.this.domain_name
}