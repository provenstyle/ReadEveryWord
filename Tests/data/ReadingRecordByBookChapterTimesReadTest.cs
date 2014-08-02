using System;
using Highway.Data.Contexts;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using Should;

// ReSharper disable CheckNamespace
// ReSharper disable UnusedMember.Local
// ReSharper disable InconsistentNaming
// ReSharper disable ConvertToLambdaExpression
namespace ProvenStyle.ReadEveryWord.Testsw.data
{
    public class when_doing_something
    {
        Establish context = () =>
        {
            _context = new InMemoryDataContext();
            _context.Add(new ReadingRecord
            {
                Book = "Gen",
                Chapter = 1,
                DateTime = DateTime.Now,
                TimesRead = 0,
                UserId = "mike"
            });
        };

        Because of = () => { };

        It should_not_find_record = () => new ReadingRecordByUserBookChapterTimesRead("mike", "asdf", 1, 0).Execute(_context).ShouldBeNull();
        It should_find_record = () => new ReadingRecordByUserBookChapterTimesRead("mike", "Gen", 1, 0).Execute(_context).ShouldNotBeNull();
        static InMemoryDataContext _context;
    }
}
