'use strict';

var express = require('express');
var router = express.Router();

var renderDataAdmin = require.main.require('./routes/handlers/render-data-admin.js');

router.get('/:model', renderDataAdmin);

module.exports = router;
