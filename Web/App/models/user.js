define(['durandal/system'], function(system) {

    return {
        username: "",
        isAuthenticated: false,
        authenticated: function(username) {
            this.username = username;
            this.isAuthenticated = true;
        },
        clear: function() {
            this.username = '';
            this.isAuthenticated = false;
            system.log('Cleared user.');
        }
    };
});