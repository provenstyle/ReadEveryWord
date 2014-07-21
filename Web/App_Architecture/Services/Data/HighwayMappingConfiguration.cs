// [[Highway.Onramp.MVC.Data]]

using System.Data.Entity;
using Highway.Data;

namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Services.Data
{
    public class HighwayMappingConfiguration : IMappingConfiguration
    {
        public void ConfigureModelBuilder(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.AddFromAssembly(this.GetType().Assembly);
        }
    }
}