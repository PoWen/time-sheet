'use strict';

var debug = require('debug')('routes');

var express = require('express');
var router = express.Router();

var homeRoutes = require.main.require('./routes/home.js');
var exportCsv = require.main.require('./routes/export-csv.js');
var jsonApi = require.main.require('./routes/json-api.js');
var modelAdmin = require.main.require('./routes/model-admin.js');

router.use('/', homeRoutes);
router.use('/export', exportCsv);
router.use('/api', jsonApi);
router.use('/data', modelAdmin);

module.exports = router;
