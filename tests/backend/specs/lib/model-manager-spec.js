'use strict';

var modelManager = require.main.require('./lib/model-manager.js');
var pvt = modelManager.pvt;

var mongoose = require('mongoose');

var schemaSetting = {
    "model": "members",
    "name": "成員",
    "schema": {
        "name": {
            "schemaType": "String",
            "setting": {
                "name": "姓名",
                "col": 0
            }
        },
        "jobTitle": {
            "schemaType": "String",
            "setting": {
                "name": "職稱",
                "col": 1
            }
        },
        "department": {
            "schemaType": {
                "type": "ObjectId",
                "ref": "departments"
            },
            "setting": {
                "name": "部門",
                "col": 2,
                "type": "select"
            }
        }
    }
};

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
    //schema.plugin(fieldsSettingPlugin, settingMap);

    it('apply fields setting plugin', function () {
        expect(fackSchema.plugin).toHaveBeenCalledWith(fieldsSettingPlugin, settingMap);
        expect(mongoose.model).toHaveBeenCalledWith(schemaSetting.model, fackSchema);
        expect(fackModel.buildFieldSettingMap).toHaveBeenCalled();
    });
});
