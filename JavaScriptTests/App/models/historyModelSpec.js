describe('historyModel', function () {
    var historyModel;
    beforeEach(module('readEveryWord'));
    // ReSharper disable once InconsistentNaming
    beforeEach(inject(function(_historyModel_) {
        historyModel = _historyModel_;
    }));

    it('should exist', function() {
        should.exist(historyModel);
    });
})