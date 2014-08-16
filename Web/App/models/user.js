define({
    username: "",
    isAuthenticated: false,
    authenticated: function(username) {
        this.username = username;
        this.isAuthenticated = true;
    },
    clear: function() {
        this.username = '';
        this.isAuthenticated = false;
    }
});