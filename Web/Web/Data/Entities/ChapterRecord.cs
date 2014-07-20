using System;

namespace ProvenStyle.ReadEveryWord.Web.Data.Entities
{
    public class ReadingRecord: BaseEntity
    {
        public string Username { get; set; }
        public string Book { get; set; }
        public int Chapter { get; set; }
        public DateTime DateTime { get; set; }
        public int TimesThrough { get; set; }
    }
}