requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'services/mockServices'],  function (system, app, viewLocator, mockServices) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Read Every Word';

    app.configurePlugins({
        router: true,
        dialog: false,
        observable: true
    });

    configureAjax();
    mockServices.mock();
    configureValidation();

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
    });


    function configureValidation() {
        $.validator.addMethod("validpassword", function (value, element) {
            return this.optional(element) ||
                /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[\W_]).*$/.test(value);
        }, "The password must contain a minimum of one lower case character," +
           " one upper case character, one digit and one special character..");

        $.validator.setDefaults({
            highlight: function (element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorClass: 'control-label has-error'
        });
    }

    function configureAjax() {
        $(document).ajaxSend(function (event, xhr, settings) {
            if (!navigator.onLine) {
                toastr.warn("Cannot connect to the internet.");
                xhr.abort();
            }
        });
    }
});