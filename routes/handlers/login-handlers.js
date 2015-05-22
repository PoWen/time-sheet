'use strict';

var renderLoginPage = function (req, res) {
    res.render('index', { title: 'Time Sheet' });
};

module.exports = renderLoginPage;
