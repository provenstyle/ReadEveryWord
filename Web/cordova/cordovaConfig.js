(function(rew) {
    rew.config = {
        basePath: function() {
            //return location.protocol + '//' + location.host; //from the web
            return 'https://bible.readeveryword.com'; //cordova
        }
    }

})(window.rew = window.rew || {});