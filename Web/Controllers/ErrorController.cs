using System.Web.Mvc;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    public class ErrorController : Controller
    {
        public ActionResult NotFound()
        {
            return View();
        }

        public ActionResult NoJavaScript()
        {
            return View();
        }
    }
}