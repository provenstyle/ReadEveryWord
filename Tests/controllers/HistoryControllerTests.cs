using Highway.Data;
using Machine.Fakes;
using Machine.Specifications;
using ProvenStyle.ReadEveryWord.Web.Controllers;
using ProvenStyle.ReadEveryWord.Web.Data;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

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
            });
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
            });
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
            });
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
            });
        };

        It should_not_add_to_data_context = () => The<IDataContext>().WasNotToldTo(x => x.Remove(Param.IsAny<ReadingRecord>()));
        It should_save = () => The<IDataContext>().WasNotToldTo(x => x.Commit());
    }
}
