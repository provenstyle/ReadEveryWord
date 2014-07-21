using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ProvenStyle.ReadEveryWord.Web.Startup))]
namespace ProvenStyle.ReadEveryWord.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
