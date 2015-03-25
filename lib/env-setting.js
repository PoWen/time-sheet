'use strict';

var reloadify = require('./reloadify');

module.exports = function (app) {
    switch (app.get('env')) {
        case 'development':
            reloadify(app, './views');
            break;
        case 'production':
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }
};
