'use strict';

var reloadify = require('./reloadify');
var bootlint = require('./bootlint');
var dbManager = require('./db-manager.js');

var enviromentSetting = function (app) {
    switch (app.get('env')) {
        case 'development':
            // assign the script to a local var so it's accessible in the view
            app.locals.reloadifyScript = reloadify(app, './views');
            app.locals.bootlintScript = bootlint();
            dbManager.init();
            break;
        case 'production':
            dbManager.init();
            break;
        case 'test':
            dbManager.init();
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }
};

module.exports = enviromentSetting;