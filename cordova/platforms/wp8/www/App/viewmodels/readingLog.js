define(['models/history', 'models/user'], function (history, user) {
    var ctor = function () {

        this.canActivate = function () {
            if (user.isAuthenticated === true) {
                return true;
            }

            return { redirect: '#login' };
        };

        this.history = history;
    };

    return ctor;
});