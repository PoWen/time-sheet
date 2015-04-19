'use strict';

var debug = require('debug')('test');

var environment = require.main.require('./lib/environment.js');
var dbManager = require.main.require('./lib/db-manager.js');

describe('run app', function () {
    it('do environment setting and init db', function () {
        spyOn(environment, 'set');
        spyOn(dbManager, 'init');
        var app = require.main.require('./timesheet.js');

        expect(environment.set).toHaveBeenCalledWith(app);
        expect(dbManager.init).toHaveBeenCalled();
    });
});