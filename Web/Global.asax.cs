using System.Data.Entity.Migrations;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using ProvenStyle.ReadEveryWord.Web.CustomModelBinders;
using ProvenStyle.ReadEveryWord.Web.Migrations;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            ModelBinders.Binders.Add(typeof(UserInfo), new UserInfoModelBinder());

            RunDbMigrations();
        }

        void RunDbMigrations()
        {
            //Having to do this explicitly because identity is using
            //it's own datacontext and if it creates the database first,
            //it will not have all of our tables
            var migrator = new DbMigrator(new Configuration());
            migrator.Update();
        }
    }
}
