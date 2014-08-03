using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    public class HistoryController : BaseApiController
    {
        IRepository _repository;
        string _userId ="michaelpdudley";

        public HistoryController(IRepository repository)
        {
            _repository = repository;
        }

        public Books Get()
        {
            var history = new Books();
            var allBooks = new List<Book>();
            allBooks.AddRange(history.OldTestamentBooks);
            allBooks.AddRange(history.NewTestamentBooks);

            var records = _repository.Find(new ReadingRecordsByUser(_userId)).ToList();
            foreach (var record in records)
            {
                var book = allBooks.FirstOrDefault(x => x.ShortName == record.Book);
                if (book != null)
                {
                    var chapter = book.Chapters.FirstOrDefault(x => x.Number == record.Chapter);
                    if (chapter != null)
                    {
                        chapter.Read = true;
                    }
                }
            }

            return history;
        }

        public void Post([FromBody]ReadingUpdate data)
        {
            var timesRead = 0;
            var record = _repository.Find(new ReadingRecordByUserBookChapterTimesRead(_userId, data.Book, data.Chapter, timesRead));
            if (data.Read && record == null)
            {
                _repository.Context.Add(new ReadingRecord
                {
                    Book = data.Book,
                    Chapter = data.Chapter,
                    DateTime = DateTime.Now,
                    TimesRead = timesRead,
                    UserId = _userId
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
