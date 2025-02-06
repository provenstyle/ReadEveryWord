// this file contains a prevent_destroy workaround to prevent the table storage account from being destroyed in production

locals {
  prevent_destroy = var.environment == "prod" ? true : false
  table_storage_name = local.prevent_destroy ? azurerm_storage_account.table_storage_protected[0].name : azurerm_storage_account.table_storage_unprotected[0].name
  table_storage_connection_string = local.prevent_destroy ? azurerm_storage_account.table_storage_protected[0].primary_connection_string : azurerm_storage_account.table_storage_unprotected[0].primary_connection_string
}

resource "azurerm_storage_account" "table_storage_protected" {
  count                    = local.prevent_destroy ? 1 : 0
  name                     = local.names.table_storage
  resource_group_name      = resource.azurerm_resource_group.this.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type
  tags                     = local.tags
  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_storage_account" "table_storage_unprotected" {
  count                    = local.prevent_destroy ? 0 : 1
  name                     = local.names.table_storage
  resource_group_name      = resource.azurerm_resource_group.this.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type
  tags                     = local.tags
}

resource "azurerm_storage_table" "user" {
  name                 = "user"
  storage_account_name = local.table_storage_name
}

resource "azurerm_storage_table" "readingCycle" {
  name                 = "readingCycle"
  storage_account_name = local.table_storage_name
}

resource "azurerm_storage_table" "readingRecord" {
  name                 = "readingRecord"
  storage_account_name = local.table_storage_name
}