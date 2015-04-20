'use strict';

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');

var Q = require('q');

describe('json api', function () {
    it('responseJsonDocs function', function (done) {
        var req = {};
        req.params = {
            model: 'members'
        };

        var res = {};
        res.json = function () { }; 

        var deferred;
        spyOn(apiHandlers.pvt, 'findAllDocs').and.callFake(function () {
            deferred = Q.defer();
            return deferred.promise;
        });
        spyOn(res, 'json');

        var resloveValue = [];
        apiHandlers.responseJsonDocs(req, res).then(function () {
            expect(res.json).toHaveBeenCalledWith(resloveValue);
            done();
        });

        deferred.resolve(resloveValue);
    });
});
