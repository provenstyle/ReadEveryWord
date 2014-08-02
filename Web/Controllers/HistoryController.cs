using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
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

        public HistoryController(IRepository repository)
        {
            _repository = repository;
        }

        public History Get()
        {
            return new History();
        }

        public void Post([FromBody]ReadingUpdate data)
        {
            var timesRead = 0;
            var userId = "";
            _repository.Find(new ReadingRecordByUserBookChapterTimesRead(userId, data.Book, data.Chapter, timesRead));
            var record = new ReadingRecord()
            {
                Book = data.Book,
                Chapter = data.Chapter,
                DateTime = DateTime.Now,
                Id = Guid.NewGuid(),
                TimesRead = 0,
                UserId = "michaelpdudley"
            };


        }

        

    }

    public class ReadingUpdate
    {
        public string Book { get; set; }
        public int Chapter { get; set; }
        public bool Read { get; set; }
    }
}
