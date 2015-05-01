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

var headerDocToCSV = function (headers, doc) {
        return headers.map(function (header) {
            var value = doc[header];
            return csvEscape(value);
        }).join(',');
    };
pvt.headerDocToCSV = headerDocToCSV;

var start = function (res, modelName, headers) {
        res.set('Content-Type','text/csv');
        res.set('Content-Disposition','attachment; filename=' + modelName + '.csv');
        res.write(headers.map(csvEscape).join(',') + '\n');
    };
pvt.start = start;

var exportStream = function (res, modelName) {
	var headers = getHeaders(modelName);
	var deferred = Q.defer();
    var started = false;
    var stream = findAllDocs(modelName);

    stream.on('data', function (doc) {
        if (!started) {
            start(res, modelName, headers);
            started = true;
        }

        res.write(headerDocToCSV(headers, doc) + '\n');
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
