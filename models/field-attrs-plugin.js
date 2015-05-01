'use strict';

var clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

var fieldAttrsPlugin = function (schema, options) {
    var fields = options || { };

    var hasField = function (field) {
        return fields[field] !== undefined;
    };

    var getFieldAttrs = function (field) {
        var result = null;
        if (hasField(field)) {
            result = fields[field];
        } else if (field === undefined) {
            result = fields;
        }
        return clone(result);
    };
    schema.static('getFieldAttrs', getFieldAttrs);

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

module.exports = fieldAttrsPlugin;