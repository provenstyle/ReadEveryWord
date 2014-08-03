using System.Collections.Generic;

namespace ProvenStyle.ReadEveryWord.Web.Models
{
    public class Book
    {
        public Book(string longName, string shortName, int chapterCount)
        {
            LongName = longName;
            ShortName = shortName;
            ChapterCount = chapterCount;
            Chapters = new List<Chapter>();
            for (int i = 0; i < ChapterCount; i++)
            {
                Chapters.Add(new Chapter(i+1));
            }
        }

        public List<Chapter> Chapters { get; set; }
        public string LongName { get; set; }
        public string ShortName { get; set; }
        public int ChapterCount
        { get; set; }
    }
}