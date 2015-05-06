'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldsSettingPlugin = require.main.require('./models/fields-setting-plugin.js');

var schema = Schema({
    name: String,
});

var creaeSetting = function (name, col, type) {
    return {
        name: name,
        col: col,
        type: type,
    };
};

var settingMap = {
    name: creaeSetting('部門名稱', 0),
};

schema.plugin(fieldsSettingPlugin, settingMap);

var Department = mongoose.model('departments', schema);

module.exports = Department;
