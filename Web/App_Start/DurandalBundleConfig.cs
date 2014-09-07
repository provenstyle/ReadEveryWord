using System;
using System.Collections.Generic;
using System.Web.Optimization;

namespace ProvenStyle.ReadEveryWord.Web
{
    class NonOrderingBundleOrderer : IBundleOrderer
    {
        public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files)
        {
            return files;
        }
    }

    public class DurandalBundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
              new ScriptBundle("~/Scripts/vendor")
                  .Include("~/Scripts/jquery-{version}.js")
                  .Include("~/Scripts/jquery.validate.min.js")
                  .Include("~/Scripts/bootstrap.js")
                  .Include("~/Scripts/knockout-{version}.js")
                  .Include("~/Scripts/underscore-min.js")
                  .Include("~/Scripts/sinon-server-1.10.3.js")
                  .Include("~/Scripts/toastr.min.js")
              );

            var bundle = new StyleBundle("~/Content/css")
                .Include("~/Content/bootstrap.min.css")
                .Include("~/Content/font-awesome.min.css")
                .Include("~/Content/bootstrap-theme.min.css")
                .Include("~/Content/durandal.css")
                .Include("~/Content/starterkit.css")
                .Include("~/Content/toastr.css")

                .Include("~/Content/navbar.css")
                .Include("~/Content/splash.css")
                .Include("~/Content/readEveryWord.css");
            bundle.Orderer = new NonOrderingBundleOrderer();

            bundles.Add(bundle);
        }

        public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            //ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}