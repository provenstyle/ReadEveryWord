using System;
using System.Globalization;
using System.Linq;
using Highway.Data.Contexts;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Models;
using Should;

// ReSharper disable CheckNamespace
// ReSharper disable UnusedMember.Local
// ReSharper disable InconsistentNaming
// ReSharper disable ConvertToLambdaExpression
namespace ProvenStyle.ReadEveryWord.Testsw.data
{
    public class when_looking_up_reading_history
    {
        Establish context = () =>
        {
            _userid = "userId";
            _context = new InMemoryDataContext();
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 1, TimesRead = 0, UserId = _userid });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 2, TimesRead = 0, UserId = _userid });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 1, TimesRead = 1, UserId = _userid });
        };


        It should_find_records_from_current_reading = () =>
            new ReadingRecordsByUserAndTimesRead(_userid, 1).Execute(_context).Count().ShouldEqual(1);

        static string _userid;
        static InMemoryDataContext _context;
    }

    public class when_grouping_by_date
    {
        Establish context = () =>
        {
            _userid = "userId";
            _context = new InMemoryDataContext();
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 1, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2013, 11, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 2, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2013, 11, 2) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 3, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2013, 12, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 4, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2013, 12, 2) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 5, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 1, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 6, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 1, 2) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 7, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 2, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 8, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 2, 2) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 9, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 3, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 10, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2014, 3, 2) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 11, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2015, 1, 1) });
            _context.Add(new ReadingRecord { Book = "Gen", Chapter = 12, TimesRead = 0, UserId = _userid, DateTime = new DateTime(2015, 1, 2) });
        };

        Because of = () =>
        {
            var readingLogModel = new ReadingLogModel();

            //var ordered = _context.AsQueryable<ReadingRecord>().OrderByDescending(oo => oo.DateTime).ToList();

            //var years = ordered
            //    .GroupBy(r => r.DateTime.Year)
            //    .ToList();

            //foreach (var year in years)
            //{
            //    var readingRecordYear = new ReadingRecordYear{Year = year.Key};

            //    var months = year
            //        .GroupBy(y => y.DateTime.Month)
            //        .ToList();
            //    foreach (var month in months)
            //    {
            //        var readingRecordMonth = new ReadingRecordMonth { Month = new DateTime(2000, month.Key, 1).ToString("MMMM", CultureInfo.InvariantCulture) };
            //        readingRecordMonth.Days = month.ToList();
            //        readingRecordYear.Months.Add(readingRecordMonth);
            //    }

            //    readingLogModel.Years.Add(readingRecordYear);
            //}



            //foreach (var year in readingLogModel.Years)
            //{
            //    Console.WriteLine(year.Year);
            //    foreach (var month in year.Months)
            //    {
            //        Console.WriteLine(month.Month);
            //        foreach (var day in month.Days)
            //        {
            //            Console.WriteLine("{0} {1} {2}", day.DateTime.Day, day.Book, day.Chapter);
            //        }
            //    }
            //}

            //var ordered = _context.AsQueryable<ReadingRecord>().OrderByDescending(oo => oo.DateTime).ToList();

            //var years = ordered
            //    .GroupBy(r => r.DateTime.Year)
            //    .ToList();

            //foreach (var year in years)
            //{
            //    Console.WriteLine(year.Key);
            //    var months = year
            //        .GroupBy(y => y.DateTime.Month)
            //        .ToList();
            //    foreach (var month in months)
            //    {
            //        Console.WriteLine(new DateTime(2000, month.Key, 1).ToString("MMMM", CultureInfo.InvariantCulture));
            //        foreach (var day in month)
            //        {
            //            Console.WriteLine("{0} {1} {2}", day.DateTime.Day, day.Book, day.Chapter);
            //        }
            //    }
            //}

        };

        It should_find_records_from_current_reading = () =>
            new ReadingRecordsByUserAndTimesRead(_userid, 0).Execute(_context).Count().ShouldEqual(12);

        static string _userid;
        static InMemoryDataContext _context;
    }
}
