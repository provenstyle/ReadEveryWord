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
variable "app_scale_limit" {
  type        = string
  description = "Number of workers this function app can scale out to"
  default     = 1
}
variable "open_id_jwks_uri" {
  type        = string
  description = "openId jwks uri"
}
variable "open_id_audience" {
  type        = string
  description = "openId api audience"
}
variable "open_id_issuer" {
  type        = string
  description = "openId server address"
}
variable "keep_warm" {
  type        = bool
  description = "controls the health-check function timer"
  default     = false
}
