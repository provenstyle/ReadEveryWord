terraform {
  backend "azurerm" {}
}

data "terraform_remote_state" "api" {
  backend = "azurerm"
  config = {
    resource_group_name  = var.state_resource_group_name
    storage_account_name = var.state_storage_account_name
    container_name       = var.state_container_name
    # End of the state container key should always be <service>/terraform.tfstate, using that we can find other states as needed
    key = replace(var.state_key, "/read-every-word-front-end/terraform.tfstate", "/read-every-word-api/terraform.tfstate")
  }
}