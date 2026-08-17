variable "state_resource_group_name" {
  type        = string
  description = "State storage associated with this resource"
}
variable "state_storage_account_name" {
  type        = string
  description = "State storage associated with this resource"
}
variable "state_container_name" {
  type        = string
  description = "State storage associated with this resource"
}
variable "state_key" {
  type        = string
  description = "State storage key associated with this resource"
}
variable "environment" {
  type        = string
  description = "Current environment"
}
variable "location" {
  type        = string
  description = "Azure region"
}
variable "service" {
  type        = string
  description = "Service name resource belongs to, this should match the current directory name for easy tracing"
}
variable "random_length" {
  type        = number
  description = "Amount of random characters to append to resource names"
  default     = 18
}
variable "storage_account_replication_type" {
  description = "Defines the type of replication to use for this storage account"
  type        = string
  default     = "LRS"
  # default     = "GRS"
}
variable "dns_zone_name" {
  type        = string
  description = "Cloudflare DNS zone name, e.g. readeveryword.com"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone id for dns_zone_name"
}

# Worker scripts are account scoped, worker routes are zone scoped
variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account id that owns the edge worker script"
}

variable "branch_name" {
  type        = string
  description = "Git branch name"
}

