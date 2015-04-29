'use strict';

var dbManager = require.main.require('./lib/db-manager.js');
var Q = require('q');

var exportCsvHandlers = {};
exportCsvHandlers.pvt = {};
var pvt = exportCsvHandlers.pvt;

var csvEscape = function (field) {
  // I, "Charles" -> "I, ""Charles"""
  return '"' + (''+field || '').replace(/"/g, '""') + '"';
};

exportCsvHandlers.exportCsv = function (req, res) {
	var modelName = req.params.model;
	
    return pvt.exportStream(res, modelName).then(function () {
        console.log('database',modelName,'csv exported');
    });
};


var findAllDocs = function (modelName) {
    var Model = dbManager.getDbModel(modelName);
    var streamOut = Model.find().stream();
    return streamOut;
};
pvt.findAllDocs = findAllDocs;

var getHeaders = function (modelName) {
    var Model = dbManager.getDbModel(modelName);
    var schema = Model.schema;
    var headers = [];
    schema.eachPath(function (key) {
        headers.push(key);
    });
    return headers;
};
pvt.getHeaders = getHeaders;

var exportStream = function (res, modelName) {
	var headers = getHeaders(modelName);

	var deferred = Q.defer();

    var docToCSV = function (doc) {
        return headers.map(function (header) {
            var value = doc[header];
            return csvEscape(value);
        }).join(',');
    };

    
    var started = false;
    var start = function (response) {
        response.set('Content-Type','text/csv');
        response.set('Content-Disposition','attachment; filename=' + modelName + '.csv');
        response.write(headers.map(csvEscape).join(',') + '\n');
        started = true;
    };

    var stream = findAllDocs(modelName);

    stream.on('data', function (doc) {
        if (!started) {
            start(res);
        }

        res.write(docToCSV(doc) + '\n');
    });
    stream.on('close', function () {
        res.end();
        deferred.resolve();
    });
    stream.on('error', function (err) {
        res.send(500, { err: err, msg: "Failed to get members from db" });
    });
    return deferred.promise;
};
pvt.exportStream = exportStream;

module.exports = exportCsvHandlers;