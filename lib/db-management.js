'use strict';
//changed using online editor
var mongoose = require('mongoose');
var dbNames = ['user', 'timeSheet'];
var mongoServerURL = 'mongodb://localhost/';

var connectionSet = { };

var db = { };
//createConnection to DB, and put the Connection Object to db.connection
db.init = function () {
    dbNames.forEach(function (dbName, index) {
        var mongoURL = mongoServerURL + dbName;
        connectionSet[dbName] = mongoose.createConnection(mongoURL);

        connectionSet[dbName].on('open', function () {
		    console.log('The opened db connection is: ' + dbName);

            if (index === dbNames.length - 1) {
				console.log('We have connected to DB: ',db.listConnectedDbs().toString());
				db.close('user', function () {
				    console.log('After remove connection to user, we connect to DB: ',db.listConnectedDbs().toString());
				});
            }
        });
	});
};

//close the specific db connection;
db.close = function (dbName, callback) {
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

//get the connection name(dbNames) array
db.listConnectedDbs = function () {
	var names = [];
	for (var key in connectionSet) {
		names.push(connectionSet[key].name);
	}
	return names;
};

//get the Connection object
db.getDbByDbName = function (dbName) {
	return connectionSet[dbName];
};

db.getDb = function () {
	return connectionSet.timesheet;
};

db.getAccountDb = function () {
	return connectionSet.user;
};

module.exports = db;
