using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        It should_have_old_testament_books = () => Subject.OldTestamentBooks.Count().ShouldEqual(39);
        It should_have_new_testament_books = () => Subject.NewTestamentBooks.Count().ShouldEqual(27);
        It chapters_should_start_with_1 = () => Subject.Books.First().Chapters.First().Number.ShouldEqual(1);
    }
}
