var debug = require('debug')('test');
var express = require('express');

var enviromentSetting = require('../lib/env-setting.js');

describe('node env setting', function () {
    it('in development', function () {
        process.env.NODE_ENV = 'development';
        var app = express();
        enviromentSetting(app);

        expect(app.locals.reloadifyScript).toMatch(/<script>.*<\/script>/);
    });
    it('in production', function () {
        process.env.NODE_ENV = 'production';
        var app = express();
        enviromentSetting(app);

        expect(app.locals.reloadifyScript).not.toMatch(/<script>.*<\/script>/);
    });
});
