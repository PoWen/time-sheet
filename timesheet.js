//load outer modules
var debug = require('debug')('app');
var path = require('path');
var express = require('express');

//open the connection to DB
var db = require('./lib/db-management.js');
db.init();

//load inner modules
var enviromentSetting = require('./lib/env-setting.js');
var routes = require('./routes/routes.js');

var app = express();

enviromentSetting(app);

var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function (name, options) {
            if (!this.addedSections) this.addedSections = {};
            this.addedSections[name] = options.fn(this);
            return null;
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

app.listen(app.get('port'), function () {
    console.log('Expres started on http://localhost:' + app.get('port'));
    console.log('press Ctrl-C to terminate.');
});

module.exports = app;
