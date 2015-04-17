'use strict';

var mongoose = require('mongoose');

var dbManager = require('../lib/db-manager.js');

var memberSchema = new mongoose.Schema({
    name: String,
    jobTitle: String
});

var Member = dbManager.getDb().model('members', memberSchema);

module.exports = Member;