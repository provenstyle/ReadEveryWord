// [[Highway.Onramp.MVC.Data]]

using System;
using Highway.Data;

namespace ProvenStyle.ReadEveryWord.Web.Data.Entities
{
    public abstract class BaseEntity : IIdentifiable<Guid>
    {
        public Guid Id { get; set; }
    }
}
