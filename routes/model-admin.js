'use strict';

var express = require('express');
var router = express.Router();

var dbManager = require.main.require('./lib/db-manager.js');

router.get('/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    res.render('data-admin', { title: Model.modelName });
});

module.exports = router;