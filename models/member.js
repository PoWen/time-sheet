'use strict';

var mongoose = require('mongoose');

var dbManager = require('../lib/db-manager.js');

var memberSchema = new mongoose.Schema({
    name: String,
    jobTitle: String
});

var Member = dbManager.getDb().model('members', memberSchema);

Member.SchemaOrder = function () {
	return ['name jobTitle'];
}

module.exports = Member;