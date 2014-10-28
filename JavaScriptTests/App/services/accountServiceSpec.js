//describe('accountService', function () {
//    var accountService;
//    var userModel;
//    beforeEach(module('readEveryWord'));

//    beforeEach(inject(function (_accountService_, _userModel_) {
//        accountService = _accountService_;
//        userModel = _userModel_;
//    }));

//    it('should exist', function () {
//        should.exist(accountService);
//    });

//    describe('register', function () {
//        var server = sinon.fakeServer.create();
//        beforeEach(function () {
//            server = sinon.fakeServer.create();
//            server.autoRespond = true;
//        });

//        afterEach(function () {
//            server.restore();
//        });

//        it('', function (done) {
//            var spy = sinon.spy(userModel, 'authenticated');
//            server.respondWith([400, {}, '']);

//            accountService.register('email', 'password', 'confirmPassword')
//                .finally(function () {
//                    assert(spy.calledWith('email'));
//                    done();
//                });

            
//        });
//    });
//});