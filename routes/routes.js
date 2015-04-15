var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

var csvify = require('../lib/csvify.js');
 
var Member = require('../models/member.js');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/member-csv-export', function (req, res) { 
    var headers = [
        'Name', 
        'Job Title'
    ].map(csvify.escape).join(',');

    function docToCSV(doc) {
        return [
            doc.name,
            doc.jobTitle
        ].map(csvify.escape).join(',');
    }

    var started = false;
    function start(response) {
        response.set('Content-Type','text/csv');
        response.set('Content-Disposition','attachment; filename=export.csv');
        response.write(headers + '\n');
        started = true;
    }
 
    Member.find()
    .sort('name')
    .stream()
    .on('data', function (member) {
        if (!started) { start(res); }
        res.write(docToCSV(member) + '\n');
    })
    .on('close', function () {
        res.end();
    })
    .on('error', function (err) {
        res.send(500, {err: err, msg: "Failed to get members from db"});
    });
});

module.exports = router;
