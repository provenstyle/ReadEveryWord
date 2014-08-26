define(['durandal/system'], function (system) {

    var server,
        params,
        urisToMock = [];

    function parseQueryParameters() {
        var index = {};
        var kvps = location.search.substring(1).split("&");
        _.each(kvps, function (kvp) {
            var kv = kvp.split("=");
            if (kv.length === 2) {
                index.any = true;
                index[kv[0].trim()] = kv[1].trim();
            }
        });
        return index;
    }

    function setUpFakeServer() {
        server = sinon.fakeServer.create();
        server.autoRespond = true;
        server.xhr.useFilters = true;

        //only mock what I tell you to
        server.xhr.addFilter(function (method, uri) {
            var matched = false;

            function isMatch(matcher) {
                return uri.indexOf(matcher) > -1;
            }

            // Check all matchers to see if one matches the incoming URI.
            for (var i = 0; i < urisToMock.length; i++) {
                matched = isMatch(urisToMock[i]);
                if (matched) {
                    system.log("mocking: " + uri);
                    break;
                }
            }

            // Sinon FakeXHR filters need to return `false` if the request should be stubbed and
            // `true` if it should be allowed to pass through.
            return !matched;
        });
    }

    return {
        mock: function () {
            params = parseQueryParameters();
            if (params.any === true) {
                setUpFakeServer();

                if (params.getHistory) {
                    urisToMock.push('/api/history');
                    server.respondWith('GET', '/api/history', [Number(params.getHistory), {}, '']);
                }
            }
        }
    };
});