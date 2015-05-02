'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldAttrsPlugin = require.main.require('./models/field-attrs-plugin.js');

var schema = Schema({
    name: String,
});

var createAttr = function (name, col, type) {
    return {
        name: name,
        col: col,
        type: type,
    };
};

var attrs = {
    name: createAttr('部門名稱', 0),
};

schema.plugin(fieldAttrsPlugin, attrs);

var Department = mongoose.model('departments', schema);

module.exports = Department;
