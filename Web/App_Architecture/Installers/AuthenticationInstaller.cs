using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;

namespace ProvenStyle.ReadEveryWord.Web.App_Architecture.Installers
{
    public class AuthenticationInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                Component.For<ApplicationUserManager>().ImplementedBy<ApplicationUserManager>()
                );
        }
    }
}