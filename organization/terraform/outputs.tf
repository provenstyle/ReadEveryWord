output "organization_domain_name" {
  value = azurerm_dns_zone.this.name
}

output "organization_resource_group_name" {
  value = azurerm_dns_zone.this.resource_group_name
}