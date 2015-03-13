//load outer modules
var path = require('path');
var express = require('express');

//load inner modules
var routes = require('./routes/routes.js');

var app = express();

switch (app.get('env')) {
    case 'development':
        require('./lib/reloadify')(app, __dirname + '/views');
        break;
    case 'production':
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

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

app.use(express.static(__dirname + '/public'));

app.use('/', routes);

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Expres started on http://localhost:' + app.get('port'));
    console.log('press Ctrl-C to terminate.');
});
