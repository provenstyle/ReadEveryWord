terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "= 4.7.0"
    }
    azurecaf = {
      source  = "aztfmod/azurecaf"
      version = "= 1.2.28"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    key_vault {
      purge_soft_deleted_certificates_on_destroy = true
    }
  }
}

# Use this to get azure information
#   data.azurerm_client_config.current.tenant_id
#   data.azurerm_client_config.current.subscription_id
#   data.azurerm_client_config.current.client_id
data "azurerm_client_config" "current" {}
