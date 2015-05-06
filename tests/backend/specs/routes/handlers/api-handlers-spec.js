'use strict';

var P = require.main.require('./tests/backend/lib/promise-mock.js');

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');
var pvt = apiHandlers.pvt;

//Model for test example
var Model = require.main.require('./tests/mocks/model-for-test.js');
var modelName = Model.modelName;

var db = require.main.require('./tests/mocks/mock-db-response.json');

describe('json api', function () {
    var req, res;

    var getMockModelFieldsSetting = function () {
        var fieldSettingMap = Model.getFieldSettingMap();
        fieldSettingMap._id = { };
        fieldSettingMap.__v = { };
        return fieldSettingMap;
    };
    var getMockDepartmentOptions = function () {
        return db.departmentOptions;
    };
    var getMockConfig = function () {
        var fieldsSetting = getMockModelFieldsSetting();
        fieldsSetting.department.options = getMockDepartmentOptions();
        var mockConfig = {
            model: modelName,
            fields: fieldsSetting,
        };
        return mockConfig;
    };

    var getMockDocs = function () {
        return db.docs;
    };
    var getMockData = function () {
        return db.docs;
    };

    beforeEach(function () {
        req = {};
        req.params = {
            model: modelName
        };

        res = {};
        res.json = function () { }; 
    });

    it('responseJsonConfigAndData', function (done) {
        var mockData = getMockData();
        var mockConfig = getMockConfig();
        var mockResponse = {
            config: mockConfig,
            data: mockData,
        };

        spyOn(pvt, 'getConfig').and.returnValue(P.resolvedWith(mockConfig));
        spyOn(pvt, 'getData').and.returnValue(P.resolvedWith(mockData));
        spyOn(res, 'json');

        apiHandlers.responseJsonConfigAndData(req, res).catch(function (error) {
            console.log(error.stack);
        }).finally(function () {
            expect(pvt.getConfig).toHaveBeenCalledWith(modelName);
            expect(pvt.getData).toHaveBeenCalledWith(modelName, mockConfig);
            expect(res.json).toHaveBeenCalledWith(mockResponse);
            done();
        });
    });

    describe('getData: ', function () {
        it('getData', function (done) {
            var mockDocs = getMockDocs();
            var mockData = getMockData();

            spyOn(pvt, 'findAllDocs').and.returnValue(P.resolvedWith(mockDocs));
            spyOn(Model, 'populate').and.returnValue(P.resolvedWith(mockData));

            var populateOpts = [{
                path: 'department',
                select: 'name'
            }];

            pvt.getData(modelName, getMockConfig()).then(function (responseData) {
                expect(responseData).toEqual(mockData);
            }).catch(function (error) {
                console.log(error.stack);
            }).finally(function () {
                expect(pvt.findAllDocs).toHaveBeenCalledWith(modelName);
                expect(Model.populate).not.toHaveBeenCalledWith(mockDocs, populateOpts);
                done();
            });
        });
    });

    describe('getConfig: model config for frontend', function () {
        it('getConfig return config', function (done) {
            //TODO add spec of findFieldOptoins
            var mockOptions = getMockDepartmentOptions();
            spyOn(pvt, 'getOptions').and.returnValue(P.resolvedWith(mockOptions));

            pvt.getConfig(modelName).then(function (config) {
                expect(config).toEqual(getMockConfig());
            }).catch(function (error) {
                console.log(error.stack);
            }).finally(function () {
                expect(pvt.getOptions).toHaveBeenCalledWith('departments');
                done();
            });
        });

        it('getSelectFields', function () {
            var fieldSettingMap = pvt.getModelFieldSettingMap(modelName);
            var selectFields = pvt.getSelectFields(fieldSettingMap);

            var target = [ 'department' ];
            expect(selectFields).toEqual(target);
        });

        it('getFieldRef', function () {
            var refField = 'department';
            var refModelName = pvt.getFieldRef(modelName, refField);

            var target = 'departments';
            expect(refModelName).toEqual(target);
        });

        it('getModelFieldSettingMap return', function () {
            var setting = pvt.getModelFieldSettingMap(modelName);
            expect(setting).toEqual(getMockModelFieldsSetting());
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

            spyOn(pvt, 'createDoc').and.returnValue(P.resolvedWith(createdDoc));
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

            spyOn(pvt, 'updateDoc').and.returnValue(P.resolvedWith(updatedDoc));
            spyOn(res, 'json');

            apiHandlers.saveJsonDocs(req, res).then(function () {
                expect(res.json).toHaveBeenCalled();
                done();
            });

        });
    });
});
