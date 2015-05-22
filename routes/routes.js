'use strict';

var debug = require('debug')('routes');

var express = require('express');
var router = express.Router();

var homeRoutes = require.main.require('./routes/home.js');
var exportCsv = require.main.require('./routes/export-csv.js');
var jsonApi = require.main.require('./routes/json-api.js');
var dataRoutes = require.main.require('./routes/data.js');
var login = require.main.require('./routes/login.js');

router.use('/home', homeRoutes);
router.use('/export', exportCsv);
router.use('/api', jsonApi);
router.use('/data', dataRoutes);
router.use('/login', login); 

router.get('/', function (req, res) {
    if (!req.session) {
        req.session.count = 1;
    } else {
        req.session.count++;
    }
    //res.send('setting session');
    req.session.save(function(){ 
        res.send('setting session');
    });
    //res.render('index', { title: 'Time Sheet' });
});

router.get('/count', function (req, res) {
    if (!req.session.count) {
        req.session.count = 0;
    }
    res.send('value in session ' + req.session.count);
});

router.get('/destroy', function (req, res) {
    req.session.destroy();
    res.send('session destroyed');
});

module.exports = router;
