using System.Web.Mvc;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    [RequireHttps]
    public class DurandalController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}