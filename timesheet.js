'use strict';

//load outer modules
var debug = require('debug')('app');
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var csrf = require('csurf');

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

//app.use(cookieParser());
//app.use(session({secret: 'any secret key', cookie: {maxAge: 60000}}));//maxAge: session life-time in msec
app.use(session({
    secret: 'noSecret',
    store: new MongoStore({
      db : 'timesheet',
      ttl: 14 * 24 * 60 * 60 // = 14 days. Default
    })
}));


app.use('/', routes);

app.use(csrf())
 
// error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here
  res.status(403)
  res.send('session has expired or form tampered with')
})
 
//routes after this

// pass the csrfToken to the view
app.get('/form', function(req, res) {
  res.render('send', { csrfToken: req.csrfToken() })
})
//and in view file


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
