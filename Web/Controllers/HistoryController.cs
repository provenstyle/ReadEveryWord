using System;
using System.Globalization;
using System.Linq;
using System.Web.Http;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Data.Scalars;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    [System.Web.Mvc.RequireHttps]
    [Authorize]
    public class HistoryController : BaseApiController
    {
        readonly IRepository _repository;

        public HistoryController(IRepository repository)
        {
            _repository = repository;
        }

        public ReadingLogModel Get(UserInfo userInfo)
        {
            var readingLogModel = new ReadingLogModel();

            var timesRead = _repository.Find(new TimesReadByUser(userInfo.UserId));
            var records = _repository.Find(new ReadingRecordsByUserAndTimesRead(userInfo.UserId, timesRead)).ToList();
            if (records.Any())
            {
                var years = records
                    .GroupBy(r => r.DateTime.Year)
                    .ToList();

                foreach (var year in years)
                {
                    var readingRecordYear = new ReadingRecordYear {Year = year.Key};

                    var months = year
                        .GroupBy(y => y.DateTime.Month)
                        .ToList();
                    foreach (var month in months)
                    {
                        var readingRecordMonth = new ReadingRecordMonth
                        {
                            Month = new DateTime(2000, month.Key, 1).ToString("MMMM", CultureInfo.InvariantCulture),
                            Days = month.Select(x => new ReadingRecordDay
                            {
                                Book = x.Book,
                                Chapter = x.Chapter,
                                Day = x.DateTime.Day
                            }).ToList()
                        };
                        readingRecordYear.Months.Add(readingRecordMonth);
                    }

                    readingLogModel.Years.Add(readingRecordYear);
                }
            }
            else
            {
                //make sure the structure is created
                var date = DateTime.Now;
                var readingRecordMonth = new ReadingRecordMonth{Month = date.ToString("MMMM", CultureInfo.InvariantCulture)};
                var readingRecordYear = new ReadingRecordYear {Year = date.Year};
                readingRecordYear.Months.Add(readingRecordMonth);
                readingLogModel.Years.Add(readingRecordYear);
            }

            return readingLogModel;
        }

        public void Post([FromBody]ReadingUpdate data, UserInfo userInfo)
        {
            var timesRead = _repository.Find(new TimesReadByUser(userInfo.UserId));

            var record = _repository.Find(new ReadingRecordByUserBookChapterTimesRead(userInfo.UserId, data.Book, data.Chapter, timesRead));
            if (data.Read && record == null)
            {
                _repository.Context.Add(new ReadingRecord
                {
                    Book = data.Book,
                    Chapter = data.Chapter,
                    DateTime = DateTime.Now,
                    TimesRead = timesRead,
                    UserId = userInfo.UserId
                });
                _repository.Context.Commit();

            }

            if (!data.Read && record != null)
            {
                _repository.Context.Remove(record);
                _repository.Context.Commit();
            }

        }
    }
}
