// [[Highway.Onramp.MVC]]

using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Common.Logging;

namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Installers
{
    public class CommonLoggingInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                Component.For<ILog>().UsingFactoryMethod((k, c) => LogManager.GetLogger(c.RequestedType))
                );
        }
    }
}
