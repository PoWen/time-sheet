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

    it('responseJsonConfigAndData call fucntions and response json', function (done) {
        var mockDocs = [{ name: 'Charles' }, { name: 'Steven'}];
        var mockConfig = { name: { name: '姓名' } };
        var target = {
            config: mockConfig,
            data: mockDocs,
        };

        spyOn(apiHandlers.pvt, 'getConfig').and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve(mockConfig);
            return deferred.promise;
        });
        spyOn(apiHandlers.pvt, 'getData').and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve(mockDocs);
            return deferred.promise;
        });
        spyOn(res, 'json');

        apiHandlers.responseJsonConfigAndData(req, res).then(function () {
            expect(apiHandlers.pvt.getConfig).toHaveBeenCalledWith(modelName);
            expect(apiHandlers.pvt.getData).toHaveBeenCalledWith(modelName, mockConfig);
            expect(res.json).toHaveBeenCalledWith(target);
            done();
        });
    });

    it('getConfig return config', function (done) {
        var mockOptions = [
                {_id: "5540bf5afea91a34148e4dcf", name: "Design"},
                {_id: "5540d784967634701b47b107", name: "Develope"},
                {_id: "5540bf94721b2f7c1660fa8f", name: "Admin"},
        ];

        spyOn(apiHandlers.pvt, 'getOptions').and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve(mockOptions);
            return deferred.promise;
        });

        var fieldAttrs = Model.getFieldAttrs();
        fieldAttrs._id = { };
        fieldAttrs.__v = { };
        fieldAttrs.department.options = mockOptions;

        var target = {
            model: modelName,
            fields: fieldAttrs,
        };

        apiHandlers.pvt.getConfig(modelName).then(function (config) {
            expect(config).toEqual(target);
            done();
        });
    });

    it('getSelectFields', function () {
        var attrs = apiHandlers.pvt.getFieldAttrs(modelName);
        var selectFields = apiHandlers.pvt.getSelectFields(attrs);

        var target = [ 'department' ];

        expect(selectFields).toEqual(target);
    });

    it('getRefModelName', function () {
        var field = 'department';

        var refModelName = apiHandlers.pvt.getRefModelName(modelName, field);

        var target = 'departments';

        expect(refModelName).toEqual(target);
    });

    it('getFieldAttrs return', function () {
        var attrs = apiHandlers.pvt.getFieldAttrs(modelName);

        var fieldAttrs = Model.getFieldAttrs();
        fieldAttrs._id = { };
        fieldAttrs.__v = { };

        var target = fieldAttrs;

        expect(attrs).toEqual(target);
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
