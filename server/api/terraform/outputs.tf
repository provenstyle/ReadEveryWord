output "names" {
  value = local.names
  description = "generated resource names"
}

output "table_storage_primary_connection_string" {
  description = "The storage account primary connection string"
  sensitive   = true
  value       = azurerm_storage_account.table_storage.primary_connection_string
}
