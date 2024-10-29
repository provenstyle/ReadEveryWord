resource "azurerm_storage_account" "table_storage" {
  name                     = local.names.table_storage
  resource_group_name      = resource.azurerm_resource_group.this.name 
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type 
  tags = local.tags 
}

resource "azurerm_storage_table" "user" {
  name                 = "user"
  storage_account_name = azurerm_storage_account.table_storage.name 
}

resource "azurerm_storage_table" "readingCycle" {
  name                 = "readingCycle"
  storage_account_name = azurerm_storage_account.table_storage.name 
}

resource "azurerm_storage_table" "readingRecord" {
  name                 = "readingRecord"
  storage_account_name = azurerm_storage_account.table_storage.name 
}