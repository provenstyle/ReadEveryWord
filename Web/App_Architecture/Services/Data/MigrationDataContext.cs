using System.Configuration;
using Highway.Data;

namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Services.Data
{
    public class MigrationDataContext : DataContext
    {
        public MigrationDataContext()
            : base(ConfigurationManager.AppSettings["EntityFramework.ConnectionString"], new HighwayMappingConfiguration())
        {
            
        }
    }
}