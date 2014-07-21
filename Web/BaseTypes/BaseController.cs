// [[Highway.Onramp.MVC]]
using System;
using System.Linq;
using System.Web.Mvc;
using Castle.Core.Logging;
using System.Collections.Generic;

namespace ProvenStyle.ReadEveryWord.Web.BaseTypes
{
    public class BaseController : Controller
    {
        public ILogger Logger { get; set; }

        public BaseController()
        {
            Logger = NullLogger.Instance;
        }
    }
}