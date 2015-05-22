'use strict';

var fieldsSettingPlugin = require.main.require('./lib/fields-setting-plugin.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

describe('fieldsSettingPlugin', function () {
    var schema, settingMap, Model;
    schema = Schema({
        name: String,
        jobTitle: String,
        department: {
            type: Schema.Types.ObjectId,
            ref: 'departments'
        }
    });

    var createSetting = function (name, col, type) {
        return {
            name: name,
            col: col,
            type: type,
        };
    };

    settingMap = {
        name: createSetting('姓名', 0),
        jobTitle: createSetting('職稱', 1),
        department: createSetting('部門', 2, 'select'),
    };

    schema.plugin(fieldsSettingPlugin, settingMap);
    Model = mongoose.model('model', schema);

    Model.buildFieldSettingMap();

    settingMap = Model.getFieldSettingMap();

    it('should add some property', function () {
        var jobTitleSetting = Model.getFieldSetting('jobTitle');
        expect(jobTitleSetting.name).toBe('職稱');
    });
    it('should add key property', function () {
        var jobTitleSetting = Model.getFieldSetting('jobTitle');
        expect(jobTitleSetting.key).toBeDefined();
        expect(jobTitleSetting.key).toBe('jobTitle');
    });
    describe('getFieldSettingMap', function () {
        schema.eachPath(function (pathName) {
            it('should include all field in schema: ' + pathName, function () {
                expect(settingMap[pathName]).toBeDefined();
            });
        });
    });
});
