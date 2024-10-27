variable "resource_names" {
  type = map(string)
  default = {
    resource_group = "azurerm_resource_group"
    table_storage  = "azurerm_storage_account"
  }
}

resource "azurecaf_name" "names" {
  for_each      = var.resource_names
  name          = each.value == "azurerm_resource_group" ? var.service : ""
  resource_type = each.value
  prefixes      = []
  suffixes      = []
  random_length = var.random_length
  clean_input   = true
  use_slug      = true
}

locals {
    names = zipmap(
      keys(resource.azurecaf_name.names),
      values(resource.azurecaf_name.names)[*].result
    )
}