describe('$httpBackend', function () {
    var $http,
        $httpBackend;

    beforeEach(inject(function (_$http_, _$httpBackend_) {
        $http = _$http_;
        $httpBackend = _$httpBackend_;
    }));

    describe('when respond', function () {

        it('should mock a simple request', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(200, 'hello');
            $http.get('/asdf')
                .success(function(data, status) {
                    data.should.equal('hello');
                    status.should.equal(200);
                })
                .finally(function () {
                    done();
                });
            $httpBackend.flush();
        });

    });
});