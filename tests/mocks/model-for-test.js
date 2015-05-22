'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldsSettingPlugin = require.main.require('./lib/fields-setting-plugin.js');

var schema = Schema({
    name: String,
    jobTitle: String,
    department: { type: Schema.Types.ObjectId, ref: 'departments' },
    gender: { type: Schema.Types.ObjectId, ref: 'genders' },
});

var createSetting = function (name, col, type) {
    return {
        name: name,
        col: col,
        type: type,
    };
};

var settingMap = {
    name: createSetting('姓名', 0),
    jobTitle: createSetting('職稱', 1),
    department: createSetting('部門', 2, 'select'),
};

schema.plugin(fieldsSettingPlugin, settingMap);

var Member = mongoose.model('members', schema);

Member.buildFieldSettingMap();

module.exports = Member;
