namespace ProvenStyle.ReadEveryWord.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class timesRead : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.TimesReads",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        UserId = c.String(),
                        Count = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ReadingRecords",
                c => new
                    {
                        Id = c.Guid(nullable: false, identity: true),
                        UserId = c.String(),
                        Book = c.String(),
                        Chapter = c.Int(nullable: false),
                        DateTime = c.DateTime(nullable: false),
                        TimesRead = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ReadingRecords");
            DropTable("dbo.TimesReads");
        }
    }
}
