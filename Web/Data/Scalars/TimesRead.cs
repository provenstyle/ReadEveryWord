using System.Linq;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

namespace ProvenStyle.ReadEveryWord.Web.Data.Scalars
{
    public class TimesReadByUser : Scalar<int>
    {
        public TimesReadByUser(string userId)
        {
            ContextQuery = c =>
            {
                var timesRead = c.AsQueryable<TimesRead>()
                    .FirstOrDefault(x => x.UserId == userId);
                return timesRead == null ? 0 : timesRead.Count;
            };
        }
    }
}