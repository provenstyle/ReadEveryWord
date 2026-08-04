
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
    # Dead entry. The static web app was replaced by frontend_storage below,
    # but removing this would shift every later index and force those
    # resources to be replaced, so it stays.
    {
      name   = "static_web_app"
      type   = "azurerm_static_site"
      prefix = ""
    },
    # azurecaf_name.names is for_each'd by list index, so new entries must be
    # appended. Inserting above renames every later resource and forces them
    # to be replaced.
    {
      name   = "log_analytics_workspace"
      type   = "azurerm_log_analytics_workspace"
      prefix = ""
    },
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