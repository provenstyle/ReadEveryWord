using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ProvenStyle.ReadEveryWord.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var origins = ConfigurationManager.AppSettings["CorsOrigins"];
            var cors = new EnableCorsAttribute(origins, "*", "GET,POST")
            {
                SupportsCredentials = true
            };
            config.EnableCors(cors);

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
