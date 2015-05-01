'use strict';
//changed using online editor
var debug = require('debug')('db-manager');
var mongoose = require('mongoose');
var Q = require('q');

var dbManager = { };

var mongoServerURL = 'mongodb://localhost/';
var dbName = 'timesheet';
var otherDbNames = ['user'];
var opts = {
    keepAlive: true
};

var connectionSet = { };

//createConnection to DB, and put the Connection Object to db.connection
dbManager.init = function () {
    var deferred = Q.defer();

    //define models
    require.main.require('./models/members.js');
    require.main.require('./models/departments.js');

    mongoose.connect(mongoServerURL + dbName, opts);

    var connection = mongoose.connection;
    connection.once('open', function () {
        console.log('db default connection opened: ', dbName);
        deferred.resolve();
    });

    otherDbNames.forEach(function (dbName) {
        var mongoURL = mongoServerURL + dbName;
        connectionSet[dbName] = mongoose.createConnection(mongoURL, opts);
        connectionSet[dbName].once('open', function () {
		    console.log('db connection opened: ', dbName);
        });
	});

    return deferred.promise;
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

//deprecated
dbManager.getDbModel = function (modelName) {
    //var db = dbManager.getDb();
    //return db.model(modelName);
    return mongoose.model(modelName);
};

dbManager.getModel = function (modelName) {
    return mongoose.model(modelName);
};

module.exports = dbManager;
