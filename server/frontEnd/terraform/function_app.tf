resource "azurerm_storage_account" "func" {
  name                     = local.names.function_app_storage
  resource_group_name      = resource.azurerm_resource_group.this.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = var.storage_account_replication_type
  tags                     = local.tags
}

resource "azurerm_application_insights" "func" {
  name                = local.names.application_insights
  resource_group_name = resource.azurerm_resource_group.this.name
  location            = var.location
  application_type    = "web"
  tags                = local.tags
}

resource "azurerm_service_plan" "func" {
  name                = local.names.app_service_plan
  resource_group_name = resource.azurerm_resource_group.this.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"
  tags                = local.tags
}

resource "azurerm_linux_function_app" "this" {
  name                       = local.names.function_app
  resource_group_name        = resource.azurerm_resource_group.this.name
  location                   = var.location
  service_plan_id            = azurerm_service_plan.func.id
  storage_account_name       = azurerm_storage_account.func.name
  storage_account_access_key = azurerm_storage_account.func.primary_access_key
  # Runtime settings and things available in function environment
  # Merge allows users to pass in additional info
  app_settings = {
    WEBSITE_MOUNT_ENABLED                 = 1,
    SCM_DO_BUILD_DURING_DEPLOYMENT        = true,
    FUNCTIONS_WORKER_RUNTIME              = "node",
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.func.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.func.connection_string
    BASE_URL                              = try(data.terraform_remote_state.api.outputs.function_app_endpoint, "api resources must be created first")
    SUBSCRIPTION_KEY                      = try(data.terraform_remote_state.api.outputs.function_app_key, "api resources must be create first")
    OPEN_ID_JWKS_URI                      = var.open_id_jwks_uri
    OPEN_ID_AUDIENCE                      = var.open_id_audience
    OPEN_ID_ISSUER                        = var.open_id_issuer
    OPEN_ID_DOMAIN                        = var.open_id_domain
    OPEN_ID_CLIENT_ID                     = var.open_id_client_id
    KEEP_WARM                             = var.keep_warm
  }
  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      app_settings["WEBSITE_RUN_FROM_PACKAGE"]
    ]
  }
  https_only = true
  site_config {
    use_32_bit_worker = false
    app_scale_limit   = var.app_scale_limit

    application_stack {
      node_version = "20"
    }
  }

  tags = local.tags
}
