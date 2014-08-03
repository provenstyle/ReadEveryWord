using System.Linq;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

// ReSharper disable once CheckNamespace
namespace ProvenStyle.ReadEveryWord.Web.Data
{
    public class ReadingRecordByUserBookChapterTimesRead : Scalar<ReadingRecord>
    {
        public ReadingRecordByUserBookChapterTimesRead(string userId, string book, int chapter, int timesRead)
        {
            ContextQuery = c =>
            {
                var record = c.AsQueryable<ReadingRecord>()
                    .FirstOrDefault(x => x.UserId == userId &&
                                         x.Book == book &&
                                         x.Chapter == chapter &&
                                         x.TimesRead == timesRead);
                return record;
            };
        }
    }
}