terraform {
  backend "azurerm" {}
}

data "terraform_remote_state" "api" {
  backend = "azurerm"
  config = {
    resource_group_name  = var.state_resource_group_name
    storage_account_name = var.state_storage_account_name
    container_name       = var.state_container_name
    key                  = var.state_key
  }
}