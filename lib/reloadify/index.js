//TODO create package.json, add dependencies
//TODO create Readme.md
//後端頁面檔案改變時，browser 自動 relaod
//在前端加上 ajax ，定期(500ms) 送 request 到 'eventstream'
//後端 watch 特別的資料夾，若有變動就送 'reload' 到前端

var sendevent = require('sendevent');
var watch = require('watch');
var uglify = require('uglify-js');
var fs = require('fs');

// create && minify static JS code to be included in the page
var polyfill = fs.readFileSync(__dirname + '/assets/eventsource-polyfill.js', 'utf8');
var clientScript = fs.readFileSync(__dirname + '/assets/client-script.js', 'utf8');
var reloadifyScript = uglify.minify(polyfill + clientScript, { fromString: true }).code;

function reloadify(app, dir) {
    // create a middlware that handles requests to `/eventstream`
    var events = sendevent('/eventstream');

    app.use(events);

    watch.watchTree(dir, { persistent: false }, function (f, curr, prev) {
        events.broadcast({ msg: 'reload' });
    });

    return '<script>' + reloadifyScript + '</script>';
}

module.exports = reloadify;
