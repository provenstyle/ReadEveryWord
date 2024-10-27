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