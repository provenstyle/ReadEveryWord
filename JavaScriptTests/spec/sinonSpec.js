describe('using sinon', function () {

    var server;

    beforeEach(function () {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
    });

    afterEach(function () {
        server.restore();
    });

    it('should create server', function () {
        expect(server).toBeDefined();
    });

    it('should fake a simple ajax request with a simple response', function (cb) {
        server.respondWith("Hello world");

        $.get('/fake/message').done(function (data) {
            expect(data).toEqual("Hello world");
            cb();
        });

        //server.respond();
    });

    it('should be able to fake individual uris', function (cb) {

        server.respondWith('/message/hello', 'hello');
        server.respondWith('/message/howdy', 'howdy');

        var p1 = $.get('/message/hello').done(function (data) {
            expect(data).toEqual('hello');
        });

        var p2 = $.get('/message/howdy').done(function (data) {
            expect(data).toEqual('howdy');
        });

        $.when(p1, p2).then(function () {
            cb();
        });

    });

    it('can return failing status codes', function (cb) {

        server.respondWith('POST', '/api/asdf', [401, {}, '']);

        $.post('/api/asdf', {})
            .fail(function (xhr) {
                expect(xhr.status).toEqual(401);
            })
            .always(function () {
                cb();
            });

    });


});