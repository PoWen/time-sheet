'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldAttrsPlugin = require.main.require('./models/field-attrs-plugin.js');

var schema = Schema({
    name: String,
    jobTitle: String,
    department: { type: Schema.Types.ObjectId, ref: 'departments' }
});

var createAttr = function (name, col, type) {
    return {
        name: name,
        col: col,
        type: type,
    };
};

var attrs = {
    name: createAttr('姓名', 0),
    jobTitle: createAttr('職稱', 1),
    department: createAttr('部門', 2, 'select'),
};

schema.plugin(fieldAttrsPlugin, attrs);

var Member = mongoose.model('members', schema);

module.exports = Member;
