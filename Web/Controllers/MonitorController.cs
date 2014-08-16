using System.Net;
using System.Net.Http;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    public class MonitorController : BaseApiController
    {
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
