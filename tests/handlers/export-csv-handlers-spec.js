'use strict';

var exportCsvHandlers = require.main.require('./routes/handlers/export-csv-handlers.js');

var Q = require('q');

describe('csv export', function () {
    var req, res;
    beforeEach(function () {
        req = {};
        req.params = {
            model: 'members'
        };

        res = {};
        res.json = function () { }; 
    });
    it('exportCsv function', function (done) {
        var deferred;
        spyOn(exportCsvHandlers.pvt, 'exportStream').and.callFake(function () {
            deferred = Q.defer();
            return deferred.promise;
        });

        exportCsvHandlers.exportCsv(req, res).then(function () {
            done();
        });

        expect(exportCsvHandlers.pvt.exportStream).toHaveBeenCalled();

        deferred.resolve();
    });
});
