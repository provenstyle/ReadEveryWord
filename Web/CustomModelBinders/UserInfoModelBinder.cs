using System.Web.Http.Controllers;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web.CustomModelBinders
{
    public class UserInfoModelBinder: System.Web.Http.ModelBinding.IModelBinder, System.Web.Mvc.IModelBinder
    {
        public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
        {
            var userInfo = new UserInfo
            {
                UserId = controllerContext.HttpContext.User.Identity.GetUserId()
            };

            return userInfo;
        }

        public bool BindModel(HttpActionContext actionContext, System.Web.Http.ModelBinding.ModelBindingContext bindingContext)
        {
            bindingContext.Model = new UserInfo
            {
                UserId = actionContext.RequestContext.Principal.Identity.GetUserId()
            };

            return true;
        }
    }
}