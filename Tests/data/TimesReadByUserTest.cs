using Highway.Data.Contexts;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Data.Scalars;
using Should;

// ReSharper disable CheckNamespace
// ReSharper disable UnusedMember.Local
// ReSharper disable InconsistentNaming
// ReSharper disable ConvertToLambdaExpression

namespace ProvenStyle.ReadEveryWord.Testsw.data
{
    public class when_looking_for_how_many_times_user_has_read_the_bible
    {
        Establish context = () =>
        {
            _context = new InMemoryDataContext();
            _context.Add(new TimesRead {Count = 1, UserId = "mike"});
            _context.Add(new TimesRead {Count = 3, UserId = "jo"});
        };

        It should = () => new TimesReadByUser("jo").Execute(_context).ShouldEqual(3);

        static InMemoryDataContext _context;
    }
}
