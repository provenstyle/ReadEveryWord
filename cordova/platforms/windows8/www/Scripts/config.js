(function(rew) {
    rew.config = {
        basePath: function() {
            //return location.protocol + '//' + location.host; //from the web
            return 'https://readeveryword.azurewebsites.net'; //embedded
        }
    }

})(window.rew = window.rew || {});