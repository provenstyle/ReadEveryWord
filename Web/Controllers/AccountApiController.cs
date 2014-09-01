using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Highway.Data;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ProvenStyle.ReadEveryWord.Web.BaseTypes;
using ProvenStyle.ReadEveryWord.Web.Data.Entities;
using ProvenStyle.ReadEveryWord.Web.Models;

namespace ProvenStyle.ReadEveryWord.Web.Controllers
{
    [System.Web.Mvc.RequireHttps]
    [System.Web.Mvc.Authorize]
    public class AccountApiController : BaseApiController
    {
        private readonly IRepository _repository;

        public AccountApiController(IRepository repository)
        {
            _repository = repository;

            UserManager.PasswordValidator = new PasswordValidator
            {
                RequireDigit = true,
                RequiredLength = 8,
                RequireLowercase = true,
                RequireNonLetterOrDigit = true,
                RequireUppercase = true
            };
        }

        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage LoggedIn()
        {
            if (User.Identity.IsAuthenticated)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { Username = User.Identity.Name});
            }

            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "User is not authenticated.");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Login([FromBody]LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await UserManager.FindAsync(model.Email, model.Password);
                if (user != null)
                {
                    await SignInAsync(user, true);
                    return Request.CreateResponse(HttpStatusCode.OK, new { Username = user.UserName });
                }
            }

            // If we got this far, something failed, redisplay form
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Invalid Username or Password");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                IdentityResult result = await UserManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await SignInAsync(user, isPersistent: false);

                    _repository.Context.Add(new TimesRead
                    {
                        Count = 0,
                        UserId = user.Id
                    });
                    _repository.Context.Commit();
                    return new HttpResponseMessage(HttpStatusCode.Created);
                }
            }

            // If we got this far, something failed, redisplay form
            return new HttpResponseMessage(HttpStatusCode.BadRequest);
        }

        [HttpGet]
        [AllowAnonymous]
        public HttpResponseMessage EmailAvailable(string email)
        {
            var user = UserManager.FindByEmail(email);
            return Request.CreateResponse(HttpStatusCode.OK, user == null);
        }

        [System.Web.Mvc.HttpPost]
        public IHttpActionResult LogOff()
        {
            AuthenticationManager.SignOut();
            return Ok();
        }

        private ApplicationUserManager UserManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
        }

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Authentication;
            }
        }

        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, await user.GenerateUserIdentityAsync(UserManager));
        }
    }
}