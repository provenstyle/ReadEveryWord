describe('historyService', function () {
    var historyService,
        $httpBackend;
    beforeEach(module('readEveryWord'));
    beforeEach(inject(function (_$httpBackend_, _historyService_) {
        $httpBackend = _$httpBackend_;
        historyService = _historyService_;
    }));

    describe('getHistory', function () {

        it('returns data', function (done) {
            $httpBackend
                .when('GET', '/api/history')
                .respond(200, 'data');

            historyService.getHistory()
                .then(function (response) {
                    response.status.should.equal(200);
                    response.data.should.equal('data');
                    done();
                });
            $httpBackend.flush();
        });
    });

});