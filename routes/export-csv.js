'use strict';

var express = require('express');
var router = express.Router();

var exportCsvHandlers = require.main.require('./routes/handlers/export-csv-handlers.js');

router.get('/:model', exportCsvHandlers.exportCsv);

module.exports = router; 

