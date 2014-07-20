// [[Highway.Onramp.MVC]]

using System.Web.Http;
using System.Web.Http.Dispatcher;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(ApiConfigurationActivator),
    "PostStartup")]
namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators
{
    public static class ApiConfigurationActivator
    {
        public static void PostStartup()
        {
#pragma warning disable 618
            var activator = IoC.Container.Resolve<IHttpControllerActivator>();
#pragma warning restore 618
            GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator), activator);
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings =
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };
        }
    }
}
