(function(rew) {
    rew.config = {
        basePath: function() {
            return 'https://localhost:7800';
            //return location.protocol + '//' + location.host; //from the web
            //return 'https://ReadEveryWord'; //embedded
        }
    }

})(window.rew = window.rew || {});