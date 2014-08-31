(function(rew) {
    rew.config = {
        basePath: function() {
            //return location.protocol + '//' + location.host; //from the web
            return 'https://ReadEveryWord.com'; //embedded
        }
    }

})(window.rew = window.rew || {});