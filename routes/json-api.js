'use strict';

var express = require('express');
var bodyparser = require('body-parser');
var router = express.Router();

var dbManager = require.main.require('./lib/db-manager.js');

router.get('/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    Model.find(function (err, docs) {
        res.json(docs);
    });
});

router.use(bodyparser.json());
router.post('/:model', function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    var options = {
        new: true,
        upsert: false,
    };

    if (req.body._id === undefined) {
        Model.create(req.body, function (err, doc) {
            res.json({ isNew: true, data: doc });
        });
    } else {
        Model.findOneAndUpdate({ _id: req.body._id }, req.body, options, function (err, doc) {
            res.json({ isNew: false, data: doc });
        });
    }

});

module.exports = router;