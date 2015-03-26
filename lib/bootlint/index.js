var uglify = require('uglify-js');
var fs = require('fs');

var clientScript = fs.readFileSync(__dirname + '/run-bootlint.js', 'utf8');
var bootlintScript = uglify.minify(clientScript, { fromString: true }).code;

var bootlint = function () {
    return '<script>' + bootlintScript + '</script>';
};

module.exports = bootlint;