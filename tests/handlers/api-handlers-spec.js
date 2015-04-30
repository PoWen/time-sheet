'use strict';

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');

//Model for test example
var Model = require.main.require('./models/members.js');
var modelName = Model.modelName;

var Q = require('q');

describe('json api', function () {
    var req, res;
    beforeEach(function () {
        req = {};
        req.params = {
            model: modelName
        };

        res = {};
        res.json = function () { }; 
    });

    it('responseJsonDocs call fucntions and response json', function (done) {
        var mockDocs = [{ name: 'Charles' }, { name: 'Steven'}];
        var mockConfig = { name: { name: '姓名' } };

        spyOn(apiHandlers.pvt, 'getConfig').and.returnValue(mockConfig);

        var deferred;
        spyOn(apiHandlers.pvt, 'findAllDocs').and.callFake(function () {
            deferred = Q.defer();
            return deferred.promise;
        });

        spyOn(res, 'json');

        var target = {
            config: mockConfig,
            data: mockDocs,
        };

        apiHandlers.responseJsonDocs(req, res).then(function () {
            expect(res.json).toHaveBeenCalledWith(target);
            done();
        });

        expect(apiHandlers.pvt.getConfig).toHaveBeenCalledWith(modelName);
        expect(apiHandlers.pvt.findAllDocs).toHaveBeenCalledWith(modelName);

        deferred.resolve(mockDocs);
    });

    it('getConfig return config', function () {
        var headers = apiHandlers.pvt.getConfig(modelName);

        var target = {
            _id: { name: null },
            __v: { name: null },
            name: { name: '姓名' },
            jobTitle: { name: '職稱' },
            department: { name: '部門' },
        };

        expect(headers).toEqual(target);
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
