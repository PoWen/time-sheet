'use strict';

var debug = require('debug')('routes');
var express = require('express');
var bodyparser = require('body-parser');

var router = express.Router();

var exportCsv = require('../lib/export-csv.js');
var dbManager = require('../lib/db-manager.js');

router.get('/', function (req, res) {
    res.render('index', { title: 'Time Sheet' });
});

router.get('/data/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    res.render('data-admin', { title: Model.modelName });
});

router.get('/api/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    Model.find(function (err, docs) {
        res.json(docs);
    });
});

router.get('/export/:model', function (req, res) { 
    var Model = dbManager.getDb().model(req.params.model);
    exportCsv(Model, res);
});

router.use(bodyparser.json());
router.post('/api/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    var options = {
        new: true,
        upsert: false,
    };

    if (req.body._id === undefined) {
        Model.create(req.body, function (err, doc) {
            res.json({ isNew: true, data: doc });
        });
    } else {
        Model.findOneAndUpdate({ _id: req.body._id }, req.body, options, function (err, doc) {
            res.json({ isNew: false, data: doc });
        });
    }

});

module.exports = router;
