locals {
  tags = {
    environment                = var.environment
    location                   = var.location
    service                    = var.service
    state_storage_account_name = var.state_storage_account_name
    state_file                 = var.state_key
  }
}