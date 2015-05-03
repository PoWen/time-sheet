'use strict';

var Q = require('q');
var mongoose = require('mongoose');

var dbManager = require.main.require('./lib/db-manager.js');

var apiHandlers = {};
apiHandlers.pvt = {};
var pvt = apiHandlers.pvt;

apiHandlers.responseJsonConfigAndData = function (req, res) {
    var modelName = req.params.model;

    return pvt.getConfig(modelName).then(function (config) {
        return pvt.getData(modelName, config).then(function (data) {
            res.json({
                config: config,
                data: data,
            });
        });
    }).catch(function (error) {
        console.log(error.stack);
    });
};

var getConfig = function (modelName) {
    var config = { };

    var fieldAttrs = pvt.getFieldAttrs(modelName);

    config.model = modelName;
    config.fields = fieldAttrs;

    return findSelectOptions(config);
};
pvt.getConfig = getConfig;

var findSelectOptions = function (config) {
    var deferred = Q.defer();

    var selectFields = getSelectFields(config.fields);

    var promiseArr = [];
    selectFields.forEach(function (field) {
        var refModelName = getRefModelName(config.model, field);
        var promise = pvt.getOptions(refModelName).then(function (options) {
            config.fields[field].options = options;
        });
        promiseArr.push(promise);
    });

    Q.all(promiseArr).then(function () {
        deferred.resolve(config);
    });

    return deferred.promise;
};

var getSelectFields = function (fieldAttrs) {
    var result = [];

    var field, attrs;
    for (field in fieldAttrs) {
        attrs = fieldAttrs[field];
        if (attrs.type === 'select') {
            result.push(field);
        }
    }
    return result;
};
pvt.getSelectFields = getSelectFields;

var getRefModelName = function (modelName, pathName) {
    var schema = mongoose.model(modelName).schema;
    var schemaType = schema.path(pathName);

    return schemaType.options.ref;
};
pvt.getRefModelName = getRefModelName;

var getOptions = function (modelName) {
    var Options = mongoose.model(modelName);
    var optionsQuery = Options.find().select('_id name');

    return optionsQuery.exec().then(function (options) {
        return options;
    });
};
pvt.getOptions = getOptions;

var getFieldAttrs = function (modelName) {
    var Model = dbManager.getModel(modelName);

    var result = { };
    Model.schema.eachPath(function (pathName) {
        var fieldAttrs = Model.getFieldAttrs(pathName);
        result[pathName] = fieldAttrs ? fieldAttrs : { };
    });

    return result;
};
pvt.getFieldAttrs = getFieldAttrs;

var getData = function (modelName) {
    return pvt.findAllDocs(modelName).then(function (docs) {
        var Model = mongoose.model(modelName);
        var opts = {
            path: 'department',
            select: 'name'
        };
        return Model.populate(docs, opts);
    });
};
pvt.getData = getData;

var findAllDocs = function (modelName) {
    var Model = mongoose.model(modelName);
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
