terraform {
  required_providers {
    azurerm = {
      # The bump off 4.7.0 is required to move off node 20 at all: 4.7.0
      # validated node_version against ["12" "14" "16" "18" "20"] and rejected
      # anything newer at plan time. "22" landed in 4.20.0 and "24" in 4.58.0.
      # 4.58.0 is what this stack has actually been applied with, so it stays
      # even though see function_app.tf - y1 cannot run 24 regardless.
      source  = "hashicorp/azurerm"
      version = "= 4.58.0"
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
