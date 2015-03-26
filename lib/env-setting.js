'use strict';

var reloadify = require('./reloadify');
var bootlint = require('./bootlint');

module.exports = function (app) {
    switch (app.get('env')) {
        case 'development':
            reloadify(app, './views');
            bootlint(app);
            break;
        case 'production':
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }
};
