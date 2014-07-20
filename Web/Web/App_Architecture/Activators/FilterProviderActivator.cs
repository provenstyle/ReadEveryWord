// [[Highway.Onramp.MVC]]

using System.Web.Mvc;
using Castle.Core.Logging;
using ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(FilterProviderActivator), 
    "PostStartup")]
namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators
{
    public static class FilterProviderActivator
    {
        private static ILogger logger = NullLogger.Instance;

        public static void PostStartup()
        {
#pragma warning disable 618
            var allProviders = IoC.Container.ResolveAll<IFilterProvider>();
#pragma warning restore 618
            foreach (var provider in allProviders)
            {
                logger.InfoFormat("Registering IFilterProvider : {0}", provider.GetType().Name);
                FilterProviders.Providers.Add(provider);
            }
        }
    }
}
