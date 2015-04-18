'use strict';

var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

var exportCsv = require('../lib/export-csv.js');
var dbManager = require('../lib/db-manager.js');

router.get('/', function (req, res) {
    res.render('index', { title: 'Time Sheet' });
});

router.get('/data/members', function (req, res) {
    res.render('members', { title: 'Members' });
});

router.get('/api/members', function (req, res) {
    var members = [
        {
            name: 'Isaddo',
            jobTitle: 'CEO'
        }, {
            name: 'Powen',
            jobTitle: 'CTO'
        }, {
            name: 'Charles',
            jobTitle: 'Manager'
        }, {
            name: 'Steven',
            jobTitle: 'Manager'
        },
    ];
    res.json(members);
});

router.get('/export/:model', function (req, res) { 
    var Model = dbManager.getDb().model(req.params.model);
    exportCsv(Model, res);
});

module.exports = router;
