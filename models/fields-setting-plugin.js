'use strict';

var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

module.exports = function (schema, options) {
    var fields = options || { };

    var key;
    for (key in fields) {
        fields[key].key = key;
    }

    var getFieldSettingMap = function () {
        return clone(fields);
    };
    schema.static('getFieldSettingMap', getFieldSettingMap);

    var hasField = function (field) {
        return fields[field] !== undefined;
    };
    var getFieldSetting = function (fieldName) {
        var result = null;
        if (hasField(fieldName)) {
            result = fields[fieldName];
        }
        return clone(result);
    };
    schema.static('getFieldSetting', getFieldSetting);

    var getName = function (field) {
        var result = null;
        if (hasField(field)) {
            result = fields[field].name;
        }
        return result;
    };
    schema.static('getName', getName);

    var getAttr = function (field, attr) {
        var result = null;
        if (hasField(field)) {
            result = fields[field][attr];
        }
        return result;
    };
    schema.static('getAttr', getAttr);
};
