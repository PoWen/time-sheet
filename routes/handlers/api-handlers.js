'use strict';

var dbManager = require.main.require('./lib/db-manager.js');

var apiHandlers = {};
apiHandlers.pvt = {};
var pvt = apiHandlers.pvt;

apiHandlers.responseJsonDocs = function (req, res) {
    var modelName = req.params.model;

    var config = pvt.getConfig(modelName);

    return pvt.findAllDocs(modelName).then(function (docs) {
        res.json({
            config: config,
            data: docs,
        });
    });
};

var getConfig = function (modelName) {
    var Model = dbManager.getModel(modelName);

    var result = { };
    Model.schema.eachPath(function (pathName) {
        result[pathName] = { };
        result[pathName].name = Model.getName(pathName);
    });

    return result;
};
pvt.getConfig = getConfig;

var findAllDocs = function (modelName) {
    var Model = dbManager.getDbModel(modelName);
    var promise = Model.find().exec();
    return promise;
};
pvt.findAllDocs = findAllDocs;

apiHandlers.saveJsonDocs = function (req, res) {
    var toSaveDoc = req.body;
    if (!exist(toSaveDoc)) {
        return pvt.createDoc(req.params.model, toSaveDoc).then(function (doc) {
            res.json({ isNew: true, data: doc });
        });
    } else {
        return pvt.updateDoc(req.params.model, toSaveDoc).then(function (doc) {
            res.json({ isNew: false, data: doc });
        });
    }
};

var exist = function (doc) {
    if (doc._id === undefined) {
        return false;
    } else {
        return true;
    }
};
pvt.exist = exist;

var createDoc = function (modelName, doc) {
    var Model = dbManager.getDbModel(modelName);
    var promise = Model.create(doc);
    return promise;
};
pvt.createDoc = createDoc;

var updateDoc = function (modelName, doc) {
    var Model = dbManager.getDbModel(modelName);
    var promise = Model.findOneAndUpdate({ _id: doc._id }, doc).exec();
    return promise;
};
pvt.updateDoc = updateDoc;

module.exports = apiHandlers;
