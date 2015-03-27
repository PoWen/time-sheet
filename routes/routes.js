'use strict';

var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

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

module.exports = router;
