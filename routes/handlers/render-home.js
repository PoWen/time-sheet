'use strict';

var renderHomePage = function (req, res) {
    res.render('index', { title: 'Time Sheet' });
};

module.exports = renderHomePage;
