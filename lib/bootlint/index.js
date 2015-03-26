var uglify = require('uglify-js');
var fs = require('fs');

var clientScript = fs.readFileSync(__dirname + '/run-bootlint.js', 'utf8');
var script = uglify.minify(clientScript, { fromString: true }).code;

var bootlint = function (app) {
    //var loadBootlint = '<script src="bootlint/bootlint.js"></script>';
    //var runBootlint = '<script> window.onload = function () { window.bootlint.showLintReportForCurrentDocument([], { hasProblems: false, problemFree: false }); }; </script>';

    //app.locals.bootlintScript = loadBootlint + runBootlint;
    app.locals.bootlintScript = '<script>' + script + '</script>';
};

module.exports = bootlint;