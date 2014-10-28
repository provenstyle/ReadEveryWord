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
                .success(function (data, status) {
                    data.should.equal('hello');
                    status.should.equal(200);
                })
                .finally(function () {
                    done();
                });
            $httpBackend.flush();
        });

    });

    describe('promises', function () {

        it('200 triggers success', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(200, 'data');
            $http.get('/asdf')
                .success(function (data, status) {
                    data.should.equal('data');
                    status.should.equal(200);
                    done();
                });

            $httpBackend.flush();
        });

        it('400 triggers error ', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(400, 'data');
            $http.get('/asdf')
                .error(function (data, status) {
                    data.should.equal('data');
                    status.should.equal(400);
                    done();
                });

            $httpBackend.flush();
        });

        it('200 triggers then', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(200, 'data');
            $http.get('/asdf')
                .then(function (response) {
                    response.data.should.equal('data');
                    response.status.should.equal(200);
                    done();
                });

            $httpBackend.flush();
        });

        it('400 triggers catch', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(400, 'data');
            $http.get('/asdf')
                .catch(function (response) {
                    response.data.should.equal('data');
                    response.status.should.equal(400);
                    done();
                });

            $httpBackend.flush();
        });

        it('300 triggers catch', function (done) {
            $httpBackend
                .when('GET', '/asdf')
                .respond(300, 'data');
            $http.get('/asdf')
                .catch(function (response) {
                    response.data.should.equal('data');
                    response.status.should.equal(300);
                    done();
                });

            $httpBackend.flush();
        });

        



    });
});