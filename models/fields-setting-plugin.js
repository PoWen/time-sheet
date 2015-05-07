'use strict';

var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

module.exports = function (schema, options) {
    options = options || { };

    var fieldSettingMap = { };
    var buildFieldSettingMap = function () {
        schema.eachPath(function (pathName) {
            var setting = options[pathName];
            if (setting) {
                fieldSettingMap[pathName] = setting;
            } else {
                fieldSettingMap[pathName] = { };
            }
        });

        var key;
        for (key in fieldSettingMap) {
            fieldSettingMap[key].key = key;
        }
    };
    schema.static('buildFieldSettingMap', buildFieldSettingMap);

    fieldSettingMap = clone(fieldSettingMap);

    var getFieldSettingMap = function () {
        return clone(fieldSettingMap);
    };
    schema.static('getFieldSettingMap', getFieldSettingMap);

    var hasField = function (field) {
        return fieldSettingMap[field] !== undefined;
    };
    var getFieldSetting = function (fieldName) {
        var result = null;
        if (hasField(fieldName)) {
            result = fieldSettingMap[fieldName];
        }
        return clone(result);
    };
    schema.static('getFieldSetting', getFieldSetting);

    var getName = function (field) {
        var result = null;
        if (hasField(field)) {
            result = fieldSettingMap[field].name;
        }
        return result;
    };
    schema.static('getName', getName);

    var getAttr = function (field, attr) {
        var result = null;
        if (hasField(field)) {
            result = fieldSettingMap[field][attr];
        }
        return result;
    };
    schema.static('getAttr', getAttr);
};
