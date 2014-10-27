describe('accountService', function() {
    var accountService;
    beforeEach(module('readEveryWord'));
    // ReSharper disable once InconsistentNaming
    beforeEach(inject(function(_accountService_) {
        accountService = _accountService_;
    }));

    it('should exist', function() {
        should.exist(accountService);
    });
});