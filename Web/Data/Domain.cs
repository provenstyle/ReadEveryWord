// [[Highway.Onramp.MVC.Data]]

using System.Collections.Generic;
using Highway.Data;
using Highway.Data.EventManagement.Interfaces;
using ProvenStyle.ReadEveryWord.Web.Configs;

namespace ProvenStyle.ReadEveryWord.Web.Data
{
    public class Domain : IDomain
    {
        public Domain(IConnectionStringConfig connString, IMappingConfiguration mappings)
        {
            ConnectionString = connString.ConnectionString;
            Mappings = mappings;
            Context = new DefaultContextConfiguration();
            Events = new List<IInterceptor>()
            {
                // Any default interceptors can go here.
            };
        }

        public string ConnectionString { get; private set; }
        public IContextConfiguration Context { get; private set; }
        public List<IInterceptor> Events { get; private set; }
        public IMappingConfiguration Mappings { get; private set; }
    }
}
