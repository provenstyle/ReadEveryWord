using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProvenStyle.ReadEveryWord.Web.Data.Entities
{
    public class TimesRead: BaseEntity
    {
        public string UserId { get; set; }
        public int Count { get; set; }
    }
}