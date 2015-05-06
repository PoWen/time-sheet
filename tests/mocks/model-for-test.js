'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldsSettingPlugin = require.main.require('./models/fields-setting-plugin.js');

var schema = Schema({
    name: String,
    jobTitle: String,
    department: { type: Schema.Types.ObjectId, ref: 'departments' }
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

module.exports = Member;
