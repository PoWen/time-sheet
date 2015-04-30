'use strict';

var fieldAttrsPlugin = function (schema, options) {
    var attrs = options || { };

    var hasAttr = function (field) {
        return attrs[field] !== undefined;
    };

    var getName = function (field) {
        var result = null;
        if (hasAttr(field)) {
            result = attrs[field].name;
        }
        return result;
    };
    schema.static('getName', getName);

    var getAttr = function (field, attr) {
        var result = null;
        if (hasAttr(field)) {
            result = attrs[field][attr];
        }
        return result;
    };
    schema.static('getAttr', getAttr);
};

module.exports = fieldAttrsPlugin;