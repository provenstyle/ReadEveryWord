using System;
using System.Collections.Generic;
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

        public IEnumerable<HistoryModel> Get(UserInfo userInfo)
        {
            var timesRead = _repository.Find(new TimesReadByUser(userInfo.UserId));
            var records = _repository.Find(new ReadingRecordsByUserAndTimesRead(userInfo.UserId, timesRead))
                .Select(x=> new HistoryModel
                {
                    Book = x.Book,
                    Chapter = x.Chapter,
                    DateTime = x.DateTime
                })
                .ToList();

            return records;
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
