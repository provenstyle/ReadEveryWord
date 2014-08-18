using System.Web.Mvc;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    [System.Web.Mvc.RequireHttps]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}