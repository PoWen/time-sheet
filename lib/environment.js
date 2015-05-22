'use strict';

//var reloadify = require.main.require('./lib/reloadify');
//var bootlint = require.main.require('./lib/bootlint');

var environment = {};

environment.set = function (app) {
    switch (app.get('env')) {
        case 'development':
            // assign the script to a local var so it's accessible in the view
            // but it will make the db connection keep connect
            // when opening more than the pool size windows will not get response
            //app.locals.reloadifyScript = reloadify(app, './views', './public');
            //app.locals.bootlintScript = bootlint();
            break;
        case 'production':
            break;
        case 'test':
            break;
        default:
            throw new Error('Unknown execution environment: ' + app.get('env'));
    }
};

module.exports = environment;