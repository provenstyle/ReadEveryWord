using System.Linq;
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
    public class when_looking_up_reading_history
    {
        Establish context = () =>
        {
            _userid = "userId";
            _context = new InMemoryDataContext();
            _context.Add(new ReadingRecord {Book = "Gen", Chapter = 1, TimesRead = 0, UserId = _userid});
            _context.Add(new ReadingRecord {Book = "Gen", Chapter = 2, TimesRead = 0, UserId = _userid});
            _context.Add(new ReadingRecord {Book = "Gen", Chapter = 1, TimesRead = 1, UserId = _userid});
        };


        It should_find_records_from_current_reading = () =>
            new ReadingRecordsByUserAndTimesRead(_userid, 1).Execute(_context).Count().ShouldEqual(1);

        static string _userid;
        static InMemoryDataContext _context;
    }
}
