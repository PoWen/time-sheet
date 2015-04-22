'use strict';

var renderDataAdmin = function (req, res) {
    var modelName = req.params.model;
    res.render('data-admin', { title: modelName });
};

module.exports = renderDataAdmin;
