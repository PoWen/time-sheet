'use strict';

var express = require('express');
var router = express.Router();

var renderHomePage = require.main.require('./routes/handlers/render-home.js');

router.get('/', renderHomePage);

module.exports = router;