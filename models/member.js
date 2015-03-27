'use strict';

var mongoose = require('mongoose');

var dbManager = require('./db-manager.js');

var memberSchema = new mongoose.Schema({
    name: String,
    jobTitle: String
});

var Member = dbManager.getDb().model('member', memberSchema);

module.exports = Member;