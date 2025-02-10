resource "azurerm_static_web_app" "app" {
  name                = local.names.static_web_app
  resource_group_name = azurerm_resource_group.this.name
  location            = var.location
  sku_tier            = "Standard"
  sku_size            = "Standard"
  tags                = local.tags
}

resource "azurerm_static_web_app_function_app_registration" "example" {
  static_web_app_id = azurerm_static_web_app.app.id
  function_app_id   = azurerm_linux_function_app.this.id
}

resource "azurerm_dns_cname_record" "this" {
  name                = "whatdoiwanthere"
  zone_name           = var.organization_domain_name
  resource_group_name = var.organization_resource_group_name
  ttl                 = 300
  record              = azurerm_static_web_app.app.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "this" {
  static_web_app_id = azurerm_static_web_app.app.id
  domain_name       = "${azurerm_dns_cname_record.this.name}.${azurerm_dns_cname_record.this.zone_name}"
  validation_type   = "cname-delegation"
}
