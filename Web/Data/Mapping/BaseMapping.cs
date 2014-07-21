// [[Highway.Onramp.MVC.Data]]

using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;

namespace ProvenStyle.ReadEveryWord.Web.Data.Mapping
{
    public abstract class BaseMapping<T> : EntityTypeConfiguration<T> where T : BaseEntity
    {
        public BaseMapping()
        {
            this.HasKey(e => e.Id);
            this.Property(e => e.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
        }
    }

}