using System.Linq;
using Machine.Fakes;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Models;
using Should;

namespace Tests
{
    public class when_doing_something : WithSubject<History>
    {
        Establish context = () => { };

        Because of = () => { };

        It should_have_all_books = () => Subject.Books.Count().ShouldEqual(66);
        It chapters_should_start_with_1 = () => Subject.Books.First().Chapters.First().Number.ShouldEqual(1);
    }
}
