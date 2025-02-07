locals {
  tags = {
    location                   = var.location
    state_storage_account_name = var.state_storage_account_name
    state_file                 = var.state_key
  }
}