using System.Collections.Generic;

namespace ProvenStyle.ReadEveryWord.Web.Models
{
    public class ReadingRecordYear
    {
        public ReadingRecordYear()
        {
            Months = new List<ReadingRecordMonth>();
        }

        public int Year { get; set; }
        public IList<ReadingRecordMonth> Months { get; set; } 
    }
}