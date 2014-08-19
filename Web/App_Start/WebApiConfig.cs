using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "accountApi",
                routeTemplate: "api/accountApi/{action}/{id}",
                defaults: new { controller = "AccountApi", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
