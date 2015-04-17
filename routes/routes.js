'use strict';

var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

var exportCsv = require('../lib/export-csv.js');

var mongoose = require('mongoose');
var dbManager = require('../lib/db-manager.js');

router.get('/', function (req, res) {
    res.render('index', { title: 'Time Sheet' });
});

router.get('/export/:model', function (req, res) { 
    var Model = dbManager.getDb().model(req.params.model);
    exportCsv(Model, res);
});

module.exports = router;
