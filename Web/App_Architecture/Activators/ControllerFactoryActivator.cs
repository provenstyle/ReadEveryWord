// [[Highway.Onramp.MVC]]

using System.Web.Mvc;
using ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(ControllerFactoryActivator), 
    "PostStartup")]
namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators
{
    public static class ControllerFactoryActivator
    {
        public static void PostStartup()
        {
#pragma warning disable 618
            IControllerFactory factory = IoC.Container.Resolve<IControllerFactory>();
#pragma warning restore 618
            ControllerBuilder.Current.SetControllerFactory(factory);
        }
    }
}