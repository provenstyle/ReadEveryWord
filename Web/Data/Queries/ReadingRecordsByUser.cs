using System.Linq;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

// ReSharper disable once CheckNamespace
namespace ProvenStyle.ReadEveryWord.Web.Data
{
    public class ReadingRecordsByUser:Query<ReadingRecord>
    {
        public ReadingRecordsByUser(string userId)
        {
            ContextQuery = c => c.AsQueryable<ReadingRecord>()
                .Where(x => x.UserId == userId);
        }
    }
}