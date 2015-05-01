'use strict';

//load outer modules
var debug = require('debug')('app');
var path = require('path');
var express = require('express');

//load inner modules
var environment = require.main.require('./lib/environment.js');
var dbManager = require.main.require('./lib/db-manager.js');
var routes = require.main.require('./routes/routes.js');

var app = express();

environment.set(app);

dbManager.init();

var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        'section': function (name, options) {
            if (!this.addedSections) this.addedSections = {};
            this.addedSections[name] = options.fn(this);
            return null;
        },
        'raw-helper': function (options) {
            return options.fn();
        }
    }
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

if (require.main === module) {
    app.listen(app.get('port'), function () {
        console.log('Express started on http://localhost:' + app.get('port'));
        console.log('press Ctrl-C to terminate.');
    });
}

module.exports = app;
