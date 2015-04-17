
var csvify = require('../lib/csvify.js');

var exportCsv = function (model, res) {
    var schema = model.schema;
    var headers = [];

    var getHeaders = function () {
        schema.eachPath(function (key, path) {
            headers.push(key);
        });
        return headers.map(csvify.escape).join(',');
    };

    var docToCSV = function (doc) {
        var values = [];

        return headers.map(function (header) {
            var value = doc[header];
            return csvify.escape(value);
        }).join(',');
    };

    var started = false;
    var start = function (response) {
        response.set('Content-Type','text/csv');
        response.set('Content-Disposition','attachment; filename=' + model.modelName + '.csv');
        response.write(getHeaders() + '\n');
        started = true;
    };

    var stream = model.find().sort('name').stream();

    stream.on('data', function (member) {
        if (!started) {
            start(res);
        }

        res.write(docToCSV(member) + '\n');
    });
    stream.on('close', function () {
        res.end();
    });
    stream.on('error', function (err) {
        res.send(500, { err: err, msg: "Failed to get members from db" });
    });
};
    
module.exports = exportCsv;