using System.Collections.Generic;

namespace ProvenStyle.ReadEveryWord.Web.Models
{
    public class ReadingLogModel
    {
        public ReadingLogModel()
        {
            Years = new List<ReadingRecordYear>();
        }
        public IList<ReadingRecordYear> Years { get; set; }
    }
}