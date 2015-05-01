'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldAttrsPlugin = require.main.require('./models/field-attrs-plugin.js');

var schema = Schema({
    name: String,
    jobTitle: String,
    department: { type: Schema.Types.ObjectId, ref: 'departments' }
});

var createAttr = function (name, type) {
    return {
        name: name,
        type: type,
    };
};

var attrs = {
    name: createAttr('姓名'),
    jobTitle: createAttr('職稱'),
    department: createAttr('部門', 'select'),
};

schema.plugin(fieldAttrsPlugin, attrs);

var Member = mongoose.model('members', schema);

module.exports = Member;
