// [[Highway.Onramp.MVC.Data]]

using System.Data.Entity;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators;
using ProvenStyle.ReadEveryWord.Web.Data;

[assembly: WebActivatorEx.PostApplicationStartMethod(
    typeof(DatabaseInitializerActivator), 
    "PostStartup")]
namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Activators
{
    public static class DatabaseInitializerActivator
    {
        public static void PostStartup()
        {
#pragma warning disable 618
            var initializer = IoC.Container.Resolve<IDatabaseInitializer<DomainContext<Domain>>>();
#pragma warning restore 618
            Database.SetInitializer(initializer);
        }
    }
}