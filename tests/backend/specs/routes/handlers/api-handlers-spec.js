'use strict';

var P = require.main.require('./tests/backend/lib/promise-mock.js');

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');
var pvt = apiHandlers.pvt;

//Model for test example
var Model = require.main.require('./tests/mocks/model-for-test.js');
var modelName = Model.modelName;
var testModelName = Model.modelName;

var db = require.main.require('./tests/mocks/mock-db-response.json');

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

    it('responseJsonConfigAndData', function (done) {
        var fakeData = db.docs;
        var fakeConfig = 'obj for frontend data admin interface';
        var fakeResponse = {
            config: fakeConfig,
            data: fakeData,
        };

        spyOn(pvt, 'getConfig').and.returnValue(P.resolvedWith(fakeConfig));
        spyOn(pvt, 'getData').and.returnValue(P.resolvedWith(fakeData));
        spyOn(res, 'json');

        apiHandlers.responseJsonConfigAndData(req, res).catch(function (error) {
            console.log(error.stack);
        }).finally(function () {
            expect(pvt.getConfig).toHaveBeenCalledWith(modelName);
            expect(pvt.getData).toHaveBeenCalledWith(modelName);
            expect(res.json).toHaveBeenCalledWith(fakeResponse);
            done();
        });
    });

    describe('getData by modelName', function () {
        it('find all docs in model async', function (done) {
            var docs = ['doc1', 'doc2', 'doc3'];
            spyOn(pvt, 'findAllDocs').and.returnValue(P.resolvedWith(docs));

            var responseData;
            pvt.getData('modelName').then(function (data) {
                responseData = data;
            }).catch(function (error) {
                console.log(error.stack);
            }).finally(function () {
                expect(pvt.findAllDocs).toHaveBeenCalledWith('modelName');
                expect(responseData).toEqual(docs);
                done();
            });
        });
    });

    describe('getConfig by modelName', function () {
        var inputModelName;
        var fakeFieldSettingMap;
        var fakeInitConfig;
        var fakeConfig;
        beforeEach(function () {
            inputModelName = 'modelName';
            fakeFieldSettingMap = {
                name: 'text field setting',
                gender: 'select field setting without options',
            };
            fakeInitConfig = {
                model: inputModelName,
                fields: fakeFieldSettingMap,
            };
            fakeConfig = {
                model: 'modelName',
                fields: {
                    name: 'text field setting',
                    gender: 'select field setting with options',
                },
            };
        });

        it('init a config and populate options if need', function (done) {
            spyOn(pvt, 'initConfig').and.returnValue(fakeInitConfig);
            spyOn(pvt, 'populateConfigOptions').and.returnValue(P.resolvedWith(fakeConfig));

            var responseConfig;
            pvt.getConfig(inputModelName).then(function (config) {
                responseConfig = config;
            }).catch(function (error) {
                console.log(error.stack);
            }).finally(function () {
                expect(pvt.initConfig).toHaveBeenCalledWith(inputModelName);
                expect(pvt.populateConfigOptions).toHaveBeenCalledWith(fakeInitConfig);
                expect(responseConfig).toEqual(fakeConfig);
                done();
            });
        });

        describe('initConfig', function () {
            it('build init config with ModelName and fieldSettingMap', function () {
                var initConfig = pvt.initConfig(testModelName);

                var settingMap = Model.getFieldSettingMap();
                expect(initConfig.model).toEqual(testModelName);
                expect(initConfig.fields).toEqual(settingMap);
            });
        });

        describe('populateConfigOptions', function () {
            var resolvedConfig;
            beforeEach(function (done) {
                spyOn(pvt, 'filterSelectFields').and.returnValue(['department', 'gender']);
                spyOn(pvt, 'populateFieldOptions').and.returnValue(P.resolvedWith());

                pvt.populateConfigOptions(fakeInitConfig).then(function (config) {
                    resolvedConfig = config;
                }).catch(function (error) {
                    console.log(error.stack);
                }).finally(function () {
                    done();
                });
            });

            it('filter fields those need options', function () {
                expect(pvt.filterSelectFields).toHaveBeenCalledWith(fakeInitConfig.fields);
            });
            it('populate options for each select field', function () {
                expect(pvt.populateFieldOptions.calls.count()).toBe(2);
            });
            it('resolve the input config with options', function () {
                expect(resolvedConfig).toBe(fakeInitConfig);
            });
        });

        describe('filterSelectFields', function () {
            var specs = [
                {
                    name: 'no select field',
                    fieldSettings: {
                        name: { key: 'name'},
                    },
                    selectFields: [],
                },
                {
                    name: 'one select field',
                    fieldSettings: {
                        name: { key: 'name'},
                        department: { key: 'department', type: 'select'},
                    },
                    selectFields: ['department'],
                },
                {
                    name: 'many select field',
                    fieldSettings: {
                        name: { key: 'name'},
                        gender: { key: 'gender', type: 'select'},
                        department: { key: 'department', type: 'select'},
                    },
                    selectFields: ['department', 'gender'],
                },
            ];
            specs.forEach(function (spec) {
                it('return an array of fieldNames type is select: ' + spec.name , function () {
                    var selectFields = pvt.filterSelectFields(spec.fieldSettings);

                    spec.selectFields.forEach(function (fieldName) {
                        expect(selectFields.indexOf(fieldName)).not.toBe(-1);
                    });
                });
            });
        });

        describe('populateFieldOptions', function () {
            var fieldSetting, modelName;
            beforeEach(function (done) {
                fieldSetting = { key: 'department', type: 'select'};
                modelName = inputModelName;
                spyOn(pvt, 'getOptionModelName').and.returnValue('optionModelName');
                spyOn(pvt, 'getOptions').and.returnValue(P.resolvedWith(db.departmentOptions));

                pvt.populateFieldOptions(fieldSetting, modelName).catch(function (error) {
                    console.log(error.stack);
                }).finally(function () {
                    done();
                });
            });

            it('getOptionModelName first', function () {
                expect(pvt.getOptionModelName).toHaveBeenCalledWith(fieldSetting.key, modelName);
            });

            it('fieldSetting has options after populate options', function () {
                var selectSpec = '_id name';
                expect(pvt.getOptions).toHaveBeenCalledWith('optionModelName', selectSpec);
                expect(fieldSetting.options).toBeDefined();
                expect(fieldSetting.options).toEqual(db.departmentOptions);
            });
        });

        describe('getOptionModelName', function () {
            var specs = [
                {
                    name: 'department',
                    fieldName: 'department',
                    optionModelName: 'departments',
                }, {
                    name: 'gender',
                    fieldName: 'gender',
                    optionModelName: 'genders',
                },
            ];
            specs.forEach(function (spec) {
                it('options of ' + spec.fieldName + ' ref to ' + spec.optionModelName, function () {
                    var optionModelName = pvt.getOptionModelName(spec.fieldName, testModelName);
                    expect(optionModelName).toBe(spec.optionModelName);
                });
            });
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
