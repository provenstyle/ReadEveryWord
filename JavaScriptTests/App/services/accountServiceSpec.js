describe('accountService', function () {
    var accountService,
        userModel,
        $httpBackend;
    beforeEach(module('readEveryWord'));

    beforeEach(inject(function (_$httpBackend_, _accountService_, _userModel_) {
        accountService = _accountService_;
        userModel = _userModel_;
        $httpBackend = _$httpBackend_;
    }));

    it('should exist', function () {
        should.exist(accountService);
    });

    describe('register', function () {
        it('should call authenticated on the usermodel when successful', function (done) {
            var spy = sinon.spy(userModel, 'authenticated');
            $httpBackend
                .when('POST', '/api/accountApi/register')
                .respond(200, {});

            accountService.register('email', 'password', 'confirmPassword')
                .finally(function () {
                    spy.should.have.been.calledWith('email');
                    done();
                });

            $httpBackend.flush();
        });

        it('should not call authenticated on the usermodel when http request has error', function (done) {
            var spy = sinon.spy(userModel, 'authenticated');
            $httpBackend
                .when('POST', '/api/accountApi/register')
                .respond(400, {});

            accountService.register('email', 'password', 'confirmPassword')
                .finally(function () {
                    spy.should.not.have.been.called;
                    done();
                });

            $httpBackend.flush();
        });
    });
});