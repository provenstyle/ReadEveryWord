using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    public class HistoryController : BaseApiController
    {
        public History Get()
        {
            return new History();
        }
    }
}
