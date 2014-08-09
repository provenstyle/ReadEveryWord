using System.Collections.Generic;
using System.Linq;
using Machine.Fakes;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Models;
using Should;

// ReSharper disable CheckNamespace
// ReSharper disable UnusedMember.Local
// ReSharper disable InconsistentNaming
// ReSharper disable ConvertToLambdaExpression
namespace Tests
{
    public class when_listing_books_of_the_bible : WithSubject<Books>
    {
        Establish context = () => { };

        Because of = () => { };

        It should_have_all_oldTestament = () => Subject.OldTestamentBooks.Count().ShouldEqual(39);
        It should_have_all_newTestament = () => Subject.NewTestamentBooks.Count().ShouldEqual(27);
        It chapters_should_start_with_1 = () => Subject.OldTestamentBooks.First().Chapters.First().Number.ShouldEqual(1);

        It should_have_unique_short_names = () =>
        {
            var all = new List<Book>();
            all.AddRange(Subject.OldTestamentBooks);
            all.AddRange(Subject.NewTestamentBooks);
            all.GroupBy(b => b.ShortName.ToLower()).Any(g => g.Count() > 1).ShouldBeFalse();
        };
    }
}
