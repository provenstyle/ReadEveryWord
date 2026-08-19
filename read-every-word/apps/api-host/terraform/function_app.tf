resource "azurerm_storage_account" "func" {
  name                     = local.names.function_app_storage
  resource_group_name      = resource.azurerm_resource_group.this.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = local.tags
}

resource "azurerm_log_analytics_workspace" "func" {
  name                = local.names.log_analytics_workspace
  resource_group_name = resource.azurerm_resource_group.this.name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_in_days
  tags                = local.tags
}

# Classic application insights is retired, so azure auto-creates a managed
# workspace and sets workspace_id. The provider refuses to remove it once set,
# so we own the workspace ourselves rather than leaving it implicit.
resource "azurerm_application_insights" "func" {
  name                = local.names.application_insights
  resource_group_name = resource.azurerm_resource_group.this.name
  location            = var.location
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.func.id
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
  # Application insights belongs in site_config below, not here. The provider
  # owns those two app settings and strips them back out on refresh, so setting
  # them here produces a diff that never converges.
  app_settings = {
    WEBSITE_MOUNT_ENABLED = 1,
    # The nx build produces a self contained dist folder that functionPush.sh
    # publishes with --no-build, so there is nothing for oryx to do.
    SCM_DO_BUILD_DURING_DEPLOYMENT  = false,
    FUNCTIONS_WORKER_RUNTIME        = "node",
    TABLE_STORAGE_CONNECTION_STRING = local.table_storage_connection_string
    # fromEnv() reads all five of these at module load and throws on any that
    # is missing, so a partial set is a cold start crash of the whole app
    # rather than one broken endpoint. They moved here from the bff, which
    # used to own token verification.
    OPEN_ID_JWKS_URI = var.open_id_jwks_uri
    OPEN_ID_AUDIENCE = var.open_id_audience
    OPEN_ID_ISSUER   = var.open_id_issuer
    # Not used to verify anything. clientConfig.get hands these to the browser
    # so the spa can configure auth0 before it has a token.
    OPEN_ID_DOMAIN    = var.open_id_domain
    OPEN_ID_CLIENT_ID = var.open_id_client_id
    # Drives the once a minute timer in apps/api-host that keeps this
    # consumption plan warm.
    KEEP_WARM = var.keep_warm
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

    application_insights_key               = azurerm_application_insights.func.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.func.connection_string

    application_stack {
      # 22, not 24. Node 24 exists for functions, but only on Dedicated,
      # ElasticPremium and Flex Consumption - the y1 linux consumption image
      # was never published. Setting NODE|24 on this plan leaves the site
      # "Running" while the container fails to start, so the host 503s, scm is
      # unavailable, and func publish fails at "Syncing triggers" with a
      # BadRequest. Confirmed against the arm stacks api:
      #   az rest --method get --url "https://management.azure.com/providers\
      #     /Microsoft.Web/functionAppStacks?api-version=2023-12-01&stackOsType=Linux"
      # whose sku list for node 24 has no Y1 entry. Note that
      # `az functionapp list-runtimes --os linux` does list 24 - it does not
      # filter by plan sku, so it cannot answer this question.
      #
      # Node 20 hit end of life 2026-04-30, which is the warning that started
      # this. 22 runs to 2027-04-30. Getting to 24 means leaving y1.
      node_version = "22"
    }
  }

  tags = local.tags
}

data "azurerm_function_app_host_keys" "api" {
  name                = azurerm_linux_function_app.this.name
  resource_group_name = resource.azurerm_resource_group.this.name
}


