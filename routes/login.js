'use strict';

var express = require('express');
var router = express.Router();

var loginHandlers = require.main.require('./routes/handlers/login-handlers.js');

router.get('/', loginHandlers);

module.exports = router; 

