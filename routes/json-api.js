'use strict';

var express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();

var apiHandlers = require.main.require('./routes/handlers/api-handlers.js');

router.get('/get-models', apiHandlers.getModels);
router.get('/:model', apiHandlers.responseJsonConfigAndData);

router.use(bodyparser.json());
router.post('/:model', apiHandlers.saveJsonDocs);

module.exports = router;