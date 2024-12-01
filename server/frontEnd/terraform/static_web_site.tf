resource "azurerm_static_web_app" "app" {
  name                = local.names.static_web_app
  resource_group_name = resource.azurerm_resource_group.this.name
  location            = var.location
  sku_tier            = "Standard"
  sku_size            = "Standard"
  app_settings = {
    FUNCTION_APP_URL = azurerm_linux_function_app.this.default_hostname
  }
  tags                = local.tags
}

resource "azurerm_static_web_app_function_app_registration" "example" {
  static_web_app_id = azurerm_static_web_app.app.id
  function_app_id   = azurerm_linux_function_app.this.id
}