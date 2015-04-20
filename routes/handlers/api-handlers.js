'use strict';

var dbManager = require.main.require('./lib/db-manager.js');

var apiHandlers = {};
apiHandlers.pvt = {};
var pvt = apiHandlers.pvt;

apiHandlers.responseJsonDocs = function (req, res) {
    var modelName = req.params.model;

    return pvt.findAllDocs(modelName).then(function (docs) {
        res.json(docs);
    });
};

var findAllDocs = function (modelName) {
    var Model = dbManager.getDbModel(modelName);
    var promise = Model.find().exec();
    return promise;
};
pvt.findAllDocs = findAllDocs;

apiHandlers.saveJsonDocs = function (req, res) {
    var Model = dbManager.getDb().model(req.params.model);

    var options = {
        new: true,
        upsert: false,
    };

    if (req.body._id === undefined) {
        Model.create(req.body, function (err, doc) {
            res.json({ isNew: true, data: doc });
        });
    } else {
        Model.findOneAndUpdate({ _id: req.body._id }, req.body, options, function (err, doc) {
            res.json({ isNew: false, data: doc });
        });
    }
};

module.exports = apiHandlers;
