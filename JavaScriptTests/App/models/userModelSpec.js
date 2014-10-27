describe('userModel', function() {
    var userModel;
    beforeEach(module('readEveryWord'));
    // ReSharper disable once InconsistentNaming
    beforeEach(inject(function(_userModel_) {
        userModel = _userModel_;
    }));

    describe('constructor defaults', function() {
        it('should not be authenticated', function() {
            userModel.isAuthenticated.should.equal(false);
        });

        it('name should be empty', function () {
            userModel.username.should.equal('');
        });
    });

    describe('authenticated', function () {

        beforeEach(function() {
            userModel.authenticated('email@email.com');
        });

        it('should set username', function () {
            userModel.username.should.equal('email@email.com');
        });

        it('should set isAuthenticated to true', function () {
            userModel.isAuthenticated.should.equal(true);
        });
    });

    describe('clear', function () {

        beforeEach(function () {
            userModel.authenticated('email@email.com');
            userModel.clear();
        });

        it('should clear username', function () {
            userModel.username.should.equal('');
        });

        it('should set isAuthenticated to false', function () {
            userModel.isAuthenticated.should.equal(false);
        });
    });
});