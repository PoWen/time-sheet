'use strict';

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');

var Q = require('q');

describe('json api', function () {
    var req, res;
    beforeEach(function () {
        req = {};
        req.params = {
            model: 'members'
        };

        res = {};
        res.json = function () { }; 
    });
    it('responseJsonDocs function', function (done) {
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

    describe('saveDocs funnction', function () {
        it('create doc when _id is undfeined', function (done) {
            req.body = {
                _id: undefined
            };

            var createdDoc = {};
            res.json = function (resContent) {
                expect(resContent.isNew).toBe(true);
                expect(resContent.data).toBe(createdDoc);
            };

            var deferred;
            spyOn(apiHandlers.pvt, 'createDoc').and.callFake(function () {
                deferred = Q.defer();
                return deferred.promise;
            });
            spyOn(res, 'json');

            apiHandlers.saveJsonDocs(req, res).then(function () {
                expect(res.json).toHaveBeenCalled();
                done();
            });

            deferred.resolve(createdDoc);
        });
        it('update doc when _id has value ', function (done) {
            req.body = {
                _id: '5532a065c8f8259e5650a278',
            };

            var updatedDoc = {};
            res.json = function (resContent) {
                expect(resContent.isNew).toBe(true);
                expect(resContent.data).toBe(updatedDoc);
            };

            var deferred;
            spyOn(apiHandlers.pvt, 'updateDoc').and.callFake(function () {
                deferred = Q.defer();
                return deferred.promise;
            });
            spyOn(res, 'json');

            apiHandlers.saveJsonDocs(req, res).then(function () {
                expect(res.json).toHaveBeenCalled();
                done();
            });

            deferred.resolve(updatedDoc);
        });
    });
});
