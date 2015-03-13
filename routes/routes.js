var debug = require('debug')('routes');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

module.exports = router;
