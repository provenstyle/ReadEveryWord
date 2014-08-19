using ProvenStyle.ReadEveryWord.Web.CustomModelBinders;

namespace ProvenStyle.ReadEveryWord.Web.Models
{
    [System.Web.Http.ModelBinding.ModelBinder(typeof(UserInfoModelBinder))]
    [System.Web.Mvc.ModelBinder(typeof(UserInfoModelBinder))]
    public class UserInfo
    {
        public string UserId { get; set; }
    }
}