// [[Highway.Onramp.MVC]]

using Castle.Core.Logging;
using ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(AnnouncementsActivator), 
    "PostStartup")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(
    typeof(AnnouncementsActivator), 
    "Shutdown")]
namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators
{
    public static class AnnouncementsActivator
    {
        private static ILogger logger = NullLogger.Instance;
        public static void PostStartup()
        {
#pragma warning disable 618
            logger = IoC.Container.Resolve<ILogger>();
#pragma warning restore 618

            logger.Info("Application Startup Completed");
        }

        public static void Shutdown()
        {
            logger.Info("Application Shutdown");
        }
    }
}