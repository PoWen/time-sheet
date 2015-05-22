'use strict';

var modelManager = require.main.require('./lib/model-manager.js');
var pvt = modelManager.pvt;

var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

describe('loadModels', function () {
    var fakeFiles = ['members.json', 'departments.json', 'members.js'];
    var fakeModel = { name: 'model'};
    beforeEach(function () {
        spyOn(pvt, 'buildModel').and.returnValue(fakeModel);
    });

    it('load model schemas from models folder', function () {
        spyOn(fs, 'readdir').and.callFake(function (modelName) {
            expect(modelName).toBe('./models');
        });

        modelManager.loadModels();
    });

    it('load model schemas from models folder', function () {
        spyOn(fs, 'readdir').and.callFake(function (modelName, callback) {
            callback(null, fakeFiles);
        });

        spyOn(pvt, 'loadModel').and.callThrough();

        modelManager.loadModels();

        expect(pvt.loadModel.calls.count()).toBe(3);
        expect(pvt.loadModel).toHaveBeenCalledWith('members.json');
        expect(pvt.loadModel).toHaveBeenCalledWith('departments.json');
        expect(pvt.buildModel.calls.count()).toBe(2);
    });
});

describe('buildModel', function () {
    var fackSchema = {
        plugin: function () {},
    };
    var settingMap = {
        fieldName: 'field setting object',
    };
    var fackModel = {
        buildFieldSettingMap: function () {},
    };
    var fieldsSettingPlugin = require.main.require('./lib/fields-setting-plugin.js');

    var schemaSetting = 'object read from model.json';

    beforeEach(function () {
        spyOn(pvt, 'createSchema').and.returnValue(fackSchema);
        spyOn(pvt, 'collectFieldSettings').and.returnValue(settingMap);
        spyOn(fackSchema, 'plugin');
        spyOn(mongoose, 'model').and.returnValue(fackModel);
        spyOn(fackModel, 'buildFieldSettingMap');

        pvt.buildModel(schemaSetting);
    });

    it('create a schema first', function () {
        expect(pvt.createSchema).toHaveBeenCalledWith(schemaSetting);
    });

    it('collect field setting', function () {
        expect(pvt.collectFieldSettings).toHaveBeenCalledWith(schemaSetting);
    });

    it('apply fields setting plugin', function () {
        expect(fackSchema.plugin).toHaveBeenCalledWith(fieldsSettingPlugin, settingMap);
        expect(mongoose.model).toHaveBeenCalledWith(schemaSetting.model, fackSchema);
        expect(fackModel.buildFieldSettingMap).toHaveBeenCalled();
    });
});

describe('createSchema', function () {
    var schemaSetting = {
        "model": "members",
        "name": "成員",
        "schema": {
            "name": {
                "valueDef": "String",
                "setting": {
                    "name": "姓名",
                    "col": 0
                }
            },
            "jobTitle": {
                "valueDef": "String",
                "setting": {
                    "name": "職稱",
                    "col": 1
                }
            },
            "department": {
                "valueDef": {
                    "type": "ObjectId",
                    "ref": "departments"
                },
                "setting": {
                    "name": "部門",
                    "col": 2,
                    "type": "select"
                }
            },
            "projects": {
                "valueDef": {
                    "type": ["ObjectId"],
                    "ref": "projects"
                },
                "setting": {
                    "name": "參與專案",
                    "col": 3,
                    "type": "multiselect"
                }
            },
        }
    };

    var expectDefinition = {
        name: String,
        jobTitle: String,
        department: {
            type: Schema.Types.ObjectId,
            ref: 'departments',
        },
        projects: {
            type: [Schema.Types.ObjectId],
            ref: 'projects',
        },
    };

    it('should call toMongooseDef', function () {
        var fakeDef = {};
        spyOn(pvt, 'toMongooseDef').and.returnValue(fakeDef);

        var fakeSchema = {};
        spyOn(mongoose, 'Schema').and.returnValue(fakeSchema);

        var result = pvt.createSchema(schemaSetting);

        expect(pvt.toMongooseDef).toHaveBeenCalledWith(schemaSetting);
        expect(mongoose.Schema).toHaveBeenCalledWith(fakeDef);
        expect(result).toBe(fakeSchema);
    });

    describe('toMongooseDef', function () {
        it('convert eache field setting to mongoose field def', function () {
            var result = pvt.toMongooseDef(schemaSetting);
            expect(result).toEqual(expectDefinition);
        });
    });
});
