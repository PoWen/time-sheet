'use strict';

var P = require.main.require('./tests/backend/lib/promise-mock.js');

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');
var pvt = apiHandlers.pvt;

//Model for test example
var Model = require.main.require('./models/members.js');
var modelName = Model.modelName;

describe('json api', function () {
    //console.log('helper', helper);
    var req, res;
    beforeEach(function () {
        req = {};
        req.params = {
            model: modelName
        };

        res = {};
        res.json = function () { }; 
    });

    it('responseJsonConfigAndData', function (done) {
        var mockDocs = [{ name: 'Charles' }, { name: 'Steven'}];
        var mockConfig = { name: { name: '姓名' } };

        var target = {
            config: mockConfig,
            data: mockDocs,
        };

        spyOn(pvt, 'getConfig').and.callFake(P.resolve(mockConfig));
        spyOn(pvt, 'getData').and.callFake(P.resolve(mockDocs));
        spyOn(res, 'json');

        apiHandlers.responseJsonConfigAndData(req, res).then(function () {
            expect(pvt.getConfig).toHaveBeenCalledWith(modelName);
            expect(pvt.getData).toHaveBeenCalledWith(modelName, mockConfig);
            expect(res.json).toHaveBeenCalledWith(target);
            done();
        });
    });

    describe('get model data', function () {
        it('getData', function (done) {
            var mockDocs = [
                {
                    "_id": "5542437cf79f7879d4048581",
                    "name": "Charles",
                    "jobTitle": "CEO",
                    "department": "5540bf94721b2f7c1660fa8f"
                }, {
                    "_id": "5542437cf79f7879d4048582",
                    "name": "Ernie",
                    "jobTitle": "CTO"
                }, {
                    "_id": "5542437cf79f7879d4048583",
                    "name": "Steven",
                    "jobTitle": "Staff",
                    "department": "5540d784967634701b47b107"
                }
            ];

            var mockData = [
                {
                    "_id": "5542437cf79f7879d4048581",
                    "name": "Charles",
                    "jobTitle": "CEO",
                    "department": {
                        "_id": "5540bf94721b2f7c1660fa8f",
                        "name": "Admin"
                    }
                }, {
                    "department": null,
                    "_id": "5542437cf79f7879d4048582",
                    "name": "Ernie",
                    "jobTitle": "CTO"
                }, {
                    "_id": "5542437cf79f7879d4048583",
                    "name": "Steven",
                    "jobTitle": "Staff",
                    "department": {
                        "_id": "5540d784967634701b47b107",
                        "name": "Develope"
                    }
                }
            ];

            spyOn(pvt, 'findAllDocs').and.callFake(P.resolve(mockDocs));
            spyOn(Model, 'populate').and.callFake(P.resolve(mockData));

            var target = mockData;

            pvt.getData(modelName).then(function (data) {
                expect(data).toEqual(target);
                done();
            });
        });
    });

    describe('get model config for front-end', function () {
        it('getConfig return config', function (done) {
            var mockOptions = [
                    {_id: "5540bf5afea91a34148e4dcf", name: "Design"},
                    {_id: "5540d784967634701b47b107", name: "Develope"},
                    {_id: "5540bf94721b2f7c1660fa8f", name: "Admin"},
            ];

            spyOn(pvt, 'getOptions').and.callFake(P.resolve(mockOptions));

            var fieldAttrs = Model.getFieldAttrs();
            fieldAttrs._id = { };
            fieldAttrs.__v = { };
            fieldAttrs.department.options = mockOptions;

            var target = {
                model: modelName,
                fields: fieldAttrs,
            };

            pvt.getConfig(modelName).then(function (config) {
                expect(config).toEqual(target);
                done();
            });
        });

        it('getSelectFields', function () {
            var attrs = pvt.getFieldAttrs(modelName);
            var selectFields = pvt.getSelectFields(attrs);

            var target = [ 'department' ];

            expect(selectFields).toEqual(target);
        });

        it('getRefModelName', function () {
            var field = 'department';

            var refModelName = pvt.getRefModelName(modelName, field);

            var target = 'departments';

            expect(refModelName).toEqual(target);
        });

        it('getFieldAttrs return', function () {
            var attrs = pvt.getFieldAttrs(modelName);

            var fieldAttrs = Model.getFieldAttrs();
            fieldAttrs._id = { };
            fieldAttrs.__v = { };

            var target = fieldAttrs;

            expect(attrs).toEqual(target);
        });
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

            spyOn(pvt, 'createDoc').and.callFake(P.resolve(createdDoc));
            spyOn(res, 'json');

            apiHandlers.saveJsonDocs(req, res).then(function () {
                expect(res.json).toHaveBeenCalled();
                done();
            });

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

            spyOn(pvt, 'updateDoc').and.callFake(P.resolve(updatedDoc));
            spyOn(res, 'json');

            apiHandlers.saveJsonDocs(req, res).then(function () {
                expect(res.json).toHaveBeenCalled();
                done();
            });

        });
    });
});
