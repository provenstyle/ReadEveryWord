﻿using System.Linq;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

// ReSharper disable once CheckNamespace
namespace ProvenStyle.ReadEveryWord.Web.Data
{
    public class ReadingRecordsByUserAndTimesRead:Query<ReadingRecord>
    {
        public ReadingRecordsByUserAndTimesRead(string userId, int timesRead)
        {
            ContextQuery = c => c.AsQueryable<ReadingRecord>()
                .Where(x => x.UserId == userId &&
                            x.TimesRead == timesRead)
                .OrderByDescending(x=>x.DateTime);


            //.GroupBy(r => new {r.DateTime.Year, r.DateTime.Month})
        }
    }
}