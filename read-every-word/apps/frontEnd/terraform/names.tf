
# Usually we will want the prefix to be empty
# But when we have multiple resources of the same type it can be confusing
variable "resource_names" {
  type = list(object({
    name   = string
    type   = string
    prefix = string
  }))
  default = [
    {
      name   = "resource_group"
      type   = "azurerm_resource_group"
      prefix = ""
    },
    # Dead entries, indexes 1 to 6. The bff was replaced by the trpc router in
    # the nx api-host and its resources are gone, along with the static web app
    # that predated frontend_storage. They stay because azurecaf_name.names is
    # for_each'd by list index: removing any of them shifts frontend_storage
    # down, which regenerates its name and forces the live storage account
    # holding $web to be replaced.
    #
    # Keeping them also means a rollback recreates the bff under its original
    # names rather than new ones.
    {
      name   = "function_app_storage"
      type   = "azurerm_storage_account"
      prefix = "fa"
    },
    {
      name   = "application_insights"
      type   = "azurerm_application_insights"
      prefix = ""
    },
    {
      name   = "app_service_plan"
      type   = "azurerm_app_service_plan"
      prefix = ""
    },
    {
      name   = "function_app"
      type   = "azurerm_function_app"
      prefix = ""
    },
    {
      name   = "static_web_app"
      type   = "azurerm_static_site"
      prefix = ""
    },
    {
      name   = "log_analytics_workspace"
      type   = "azurerm_log_analytics_workspace"
      prefix = ""
    },
    # New entries must be appended. Inserting above renames every later
    # resource and forces it to be replaced.
    # Serves the built ui out of its $web container. The fa prefix is already
    # taken by the function app's storage, so this one gets web.
    {
      name   = "frontend_storage"
      type   = "azurerm_storage_account"
      prefix = "web"
    }
  ]
}

# a lot of foreach hand ringing so we don't have to specify each name
resource "azurecaf_name" "names" {
  for_each      = { for idx, resource in var.resource_names : idx => resource }
  name          = each.value.type == "azurerm_resource_group" ? var.service : ""
  resource_type = each.value.type
  prefixes      = each.value.prefix != "" ? [each.value.prefix] : []
  suffixes      = []
  random_length = var.random_length
  clean_input   = true
  use_slug      = true
}

# putting the generated names into an easy to use format
locals {
  names = zipmap(
    [for idx, resource in var.resource_names : resource.name],
    [for idx, resource in var.resource_names : azurecaf_name.names[idx].result]
  )
}