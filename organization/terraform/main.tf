resource "azurerm_resource_group" "this" {
  name     = local.names.resource_group
  location = var.location
  tags     = local.tags
}

resource "azurerm_dns_zone" "this" {
  name                = "readeveryword.com"
  resource_group_name = azurerm_resource_group.this.name
  tags                = local.tags
}
