var mongoose = require('mongoose');
var dbName = ['user','timeSheet'];
var mongoServerURL = 'mongodb://localhost/'

var db = { };
db.connection = { };


//createConnection to DB, and put the Connection Object to db.connection
db.init = function () {
    dbName.forEach(function createConnection(value) {
            var mongoURL = mongoServerURL + value;
            db.connection[value] = mongoose.createConnection(mongoURL);
		}
	)
};

//close the specific db connection;
db.close = function (connectionName) {
	db.connection[connectionName].close();
	delete db.connection[connectionName]; //remove it from db connection

};

//get the connection name(dbName) array
db.getDB = function () {
	var dbName = [];
	var dbIndex = 0;
	for(var key in db.connection) {
		dbName[dbIndex] = db.connection[key].name;
		dbIndex++;
	}
	return dbName;
};

//get the Connection object
db.getConnection = function (connectionName) {
	return db.connection[connectionName];
};

db.getAccountDB = function () {
	
};

module.exports = db;