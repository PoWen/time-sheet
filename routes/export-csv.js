'use strict';

var express = require('express');
var router = express.Router();

var dbManager = require.main.require('./lib/db-manager.js');
var csvify = require.main.require('./lib/csvify.js');

var exportCsv = function (Model, res) {
    var schema = Model.schema;
    var headers = [];

    var getHeaders = function () {
        schema.eachPath(function (key) {
            headers.push(key);
        });
        return headers.map(csvify.escape).join(',');
    };

    var docToCSV = function (doc) {
        return headers.map(function (header) {
            var value = doc[header];
            return csvify.escape(value);
        }).join(',');
    };

    var started = false;
    var start = function (response) {
        response.set('Content-Type','text/csv');
        response.set('Content-Disposition','attachment; filename=' + Model.modelName + '.csv');
        response.write(getHeaders() + '\n');
        started = true;
    };

    var stream = Model.find().sort('name').stream();

    stream.on('data', function (doc) {
        if (!started) {
            start(res);
        }

        res.write(docToCSV(doc) + '\n');
    });
    stream.on('close', function () {
        res.end();
    });
    stream.on('error', function (err) {
        res.send(500, { err: err, msg: "Failed to get members from db" });
    });
};

router.get('/:model', function (req, res) { 
    var Model = dbManager.getDb().model(req.params.model);
    exportCsv(Model, res);
});

module.exports = router;