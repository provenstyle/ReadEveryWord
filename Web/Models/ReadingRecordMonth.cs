using System.Collections.Generic;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

namespace ProvenStyle.ReadEveryWord.Web.Models
{
    public class ReadingRecordMonth
    {
        public ReadingRecordMonth()
        {
            Days = new List<ReadingRecordDay>();
        }
        public string Month { get; set; }
        public IList<ReadingRecordDay> Days { get; set; } 
    }
}