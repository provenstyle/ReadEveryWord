terraform {
  backend "azurerm" {}
}

data "terraform_remote_state" "api" {
  backend = "azurerm"
  config = {
    resource_group_name  = var.state_resource_group_name
    storage_account_name = var.state_storage_account_name
    container_name       = var.state_container_name
    key = replace(var.state_key, "/read-every-word-front-end/terraform.tfstate", "/read-every-word-api/terraform.tfstate")
  }
}