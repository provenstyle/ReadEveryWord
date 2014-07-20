// [[Highway.Onramp.MVC.Data]]
using System;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Castle.MicroKernel.SubSystems.Configuration;
using System.Data.Entity;
using Highway.Data;
using ProvenStyle.ReadEveryWord.Web.Configs;
using ProvenStyle.ReadEveryWord.Web.Data;

namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Installers
{
    public class EntityFrameworkInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var config = container.Resolve<IDatabaseInitializerConfig>();
            switch (config.Initializer)
            {
                case Configs.InitializerTypes.DropCreateDatabaseAlways:
                    container.Register(Component.For<IDatabaseInitializer<DomainContext<Domain>>>()
                        .ImplementedBy<DropCreateDatabaseAlways<DomainContext<Domain>>>().LifestyleSingleton());
                    break;
                case Configs.InitializerTypes.DropCreateDatabaseIfModelChanges:
                    container.Register(Component.For<IDatabaseInitializer<DomainContext<Domain>>>()
                        .ImplementedBy<DropCreateDatabaseIfModelChanges<DomainContext<Domain>>>().LifestyleSingleton());
                    break;
                case Configs.InitializerTypes.CreateDatabaseIfNotExists:
                    container.Register(Component.For<IDatabaseInitializer<DomainContext<Domain>>>()
                        .ImplementedBy<CreateDatabaseIfNotExists<DomainContext<Domain>>>().LifestyleSingleton());
                    break;
                case Configs.InitializerTypes.NullDatabaseInitializer:
                    container.Register(Component.For<IDatabaseInitializer<DomainContext<Domain>>>()
                        .ImplementedBy<NullDatabaseInitializer<DomainContext<Domain>>>().LifestyleSingleton());
                    break;
                default:
                    throw new NotImplementedException("Unknown Enumeration Value");
            }
        }
    }
}
