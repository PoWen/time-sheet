'use strict';
//changed using online editor
var debug = require('debug')('db-manager');
var mongoose = require('mongoose');

var dbManager = { };

var mongoServerURL = 'mongodb://localhost/';
var dbNames = ['user', 'timesheet'];
var opts = {
    keepAlive: true
};

var connectionSet = { };

//createConnection to DB, and put the Connection Object to db.connection
dbManager.init = function () {
    dbNames.forEach(function (dbName) {
        var mongoURL = mongoServerURL + dbName;
        connectionSet[dbName] = mongoose.createConnection(mongoURL, opts);

        connectionSet[dbName].on('open', function () {
		    console.log('db connection opened: ' + dbName);
        });
	});
};

//close the specific db connection;
dbManager.close = function (dbName, callback) {
	var db = connectionSet[dbName];
	if (!db) {
		callback();
		return;
	}

	db.close(function () {
		//remove it from db connection
		delete connectionSet[dbName];
		callback();
	});
};

dbManager.end = function () {
    for (var key in connectionSet) {
        connectionSet[key].close();
    }
};

//get the connection name(dbNames) array
dbManager.listConnectedDbs = function () {
	var names = [];
	for (var key in connectionSet) {
		names.push(connectionSet[key].name);
	}
	return names;
};

//get the Connection object
dbManager.getDbByDbName = function (dbName) {
	return connectionSet[dbName];
};

dbManager.getDb = function () {
	return connectionSet.timesheet;
};

dbManager.getAccountDb = function () {
	return connectionSet.user;
};

dbManager.init();

dbManager.getDb().on('open', function () {
    require('../models/members.js');
});

module.exports = dbManager;
