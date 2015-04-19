'use strict';

var debug = require('debug')('routes');

var express = require('express');
var router = express.Router();

var homeRoutes = require.main.require('./routes/home.js');
var exportCsv = require.main.require('./routes/export-csv.js');
var jsonApi = require.main.require('./routes/json-api.js');
var dataRoutes = require.main.require('./routes/data.js');

router.use('/', homeRoutes);
router.use('/export', exportCsv);
router.use('/api', jsonApi);
router.use('/data', dataRoutes);

module.exports = router;
