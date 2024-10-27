resource "azurerm_storage_account" "table_storage" {
  name                     = local.names.table_storage
  resource_group_name      = resource.azurerm_resource_group.this.name 
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type 
  tags = local.tags 
}