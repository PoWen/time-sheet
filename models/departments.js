'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dbManager = require.main.require('./lib/db-manager.js');
var fieldAttrsPlugin = require.main.require('./models/field-attrs-plugin.js');

var schema = Schema({
    name: String,
});

var createAttr = function (name) {
    return { name: name };
};

var attrs = {
    name: createAttr('部門名稱'),
};

schema.plugin(fieldAttrsPlugin, attrs);

var Department = dbManager.getDb().model('departments', schema);

module.exports = Department;