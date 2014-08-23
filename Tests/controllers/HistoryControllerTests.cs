using Highway.Data;
using Highway.Data.Contexts;
using Machine.Fakes;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Controllers;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Models;
using Should;

// ReSharper disable CheckNamespace
// ReSharper disable UnusedMember.Local
// ReSharper disable InconsistentNaming
// ReSharper disable ConvertToLambdaExpression
namespace ProvenStyle.ReadEveryWord.Testsw.controllers
{
    public class when_chapter_has_not_been_read_before : WithSubject<HistoryController>
    {
        Establish context = () =>
        {
            The<IRepository>()
                .WhenToldTo(x => x.Context)
                .Return(The<IDataContext>());
        };

        Because of = () =>
        {
            Subject.Post(new ReadingUpdate
            {
                Book = "Gen",
                Chapter = 1,
                Read = true
            }, new UserInfo());
        };

        It should_add_to_data_context = () => The<IDataContext>().WasToldTo(x => x.Add(Param.IsAny<ReadingRecord>()));
        It should_save = () => The<IDataContext>().WasToldTo(x => x.Commit());
        
    }

    public class when_chapter_has_been_read_before : WithSubject<HistoryController>
    {
        Establish context = () =>
        {
            The<IRepository>()
                .WhenToldTo(x => x.Context)
                .Return(The<IDataContext>());

            The<IRepository>()
                .WhenToldTo(x => x.Find(Param.IsAny<ReadingRecordByUserBookChapterTimesRead>()))
                .Return(new ReadingRecord());
        };

        Because of = () =>
        {
            Subject.Post(new ReadingUpdate
            {
                Book = "Gen",
                Chapter = 1,
                Read = true
            }, new UserInfo());
        };

        It should_not_add_to_data_context = () => The<IDataContext>().WasNotToldTo(x => x.Add(Param.IsAny<ReadingRecord>()));
        It should_not_save = () => The<IDataContext>().WasNotToldTo(x => x.Commit());
    }

    public class when_removing_chapter_that_has_already_been_saved : WithSubject<HistoryController>
    {
        Establish context = () =>
        {
            The<IRepository>()
                .WhenToldTo(x => x.Context)
                .Return(The<IDataContext>());

            The<IRepository>()
                .WhenToldTo(x => x.Find(Param.IsAny<ReadingRecordByUserBookChapterTimesRead>()))
                .Return(new ReadingRecord());
        };

        Because of = () =>
        {
            Subject.Post(new ReadingUpdate
            {
                Book = "Gen",
                Chapter = 1,
                Read = false
            }, new UserInfo());
        };

        It should_not_add_to_data_context = () => The<IDataContext>().WasToldTo(x => x.Remove(Param.IsAny<ReadingRecord>()));
        It should_save = () => The<IDataContext>().WasToldTo(x => x.Commit());
    }

    public class when_removing_chapter_that_has_not_been_saved : WithSubject<HistoryController>
    {
        Establish context = () =>
        {
            The<IRepository>()
                .WhenToldTo(x => x.Context)
                .Return(The<IDataContext>());

            The<IRepository>()
                .WhenToldTo(x => x.Find(Param.IsAny<ReadingRecordByUserBookChapterTimesRead>()))
                .Return(default(ReadingRecord));
        };

        Because of = () =>
        {
            Subject.Post(new ReadingUpdate
            {
                Book = "Gen",
                Chapter = 1,
                Read = false
            }, new UserInfo());
        };

        It should_not_add_to_data_context = () => The<IDataContext>().WasNotToldTo(x => x.Remove(Param.IsAny<ReadingRecord>()));
        It should_save = () => The<IDataContext>().WasNotToldTo(x => x.Commit());
    }

    //public class when_user_is_on_second_time_through : WithSubject<HistoryController>
    //{
    //    Establish context = () =>
    //    {
            
    //        _userId = "testUser";

    //        var _context = new InMemoryDataContext();
    //        _context.Add(new TimesRead {Count = 1, UserId = _userId});
            
    //        _context.Add(new ReadingRecord { Book = "Gen", Chapter = 1, TimesRead = 0, UserId = _userId });
    //        _context.Add(new ReadingRecord { Book = "Gen", Chapter = 2, TimesRead = 0, UserId = _userId });
    //        _context.Add(new ReadingRecord { Book = "Gen", Chapter = 1, TimesRead = 1, UserId = _userId });

    //        Configure<IDataContext>(_context);
    //        Configure<IRepository>(new Repository(_context));
    //    };

    //    Because of = () =>
    //    {
    //        _history = Subject.Get(new UserInfo{UserId = _userId});
    //    };

    //    It should_have_read_chapter_1 = () => _history.OldTestamentBooks[0].Chapters[0].Read.ShouldBeTrue();
    //    It should_not_have_read_chapter_2 = () => _history.OldTestamentBooks[0].Chapters[1].Read.ShouldBeFalse();
        
    //    static string _userId;
    //    static Books _history;
    //}
}
