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
        return pvt.getData(modelName).then(function (data) {
            res.json({
                config: config,
                data: data,
            });
        });
    }).catch(function (error) {
        console.log(error.stack);
    });
};

var getData = function (modelName) {
    return pvt.findAllDocs(modelName);
};
pvt.getData = getData;

var getConfig = function (modelName) {
    var config = pvt.initConfig(modelName);
    return pvt.populateConfigOptions(config);
};
pvt.getConfig = getConfig;

pvt.initConfig = function (modelName) {
    var Model = mongoose.model(modelName);
    var settingMap = Model.getFieldSettingMap();

    var config = { };
    config.model = modelName;
    config.fields = settingMap;

    return config;
};


pvt.populateConfigOptions = function (config) {
    var deferred = Q.defer();

    var selectFields = pvt.filterSelectFields(config.fields);

    var promiseArr = [];
    selectFields.forEach(function (field) {
        var promise = pvt.populateFieldOptions(config.fields[field], config.model);
        promiseArr.push(promise);
    });

    Q.all(promiseArr).then(function () {
        deferred.resolve(config);
    });

    return deferred.promise;
};

pvt.filterSelectFields = function (fieldSettings) {
    var result = [];

    var field, setting;
    for (field in fieldSettings) {
        setting = fieldSettings[field];
        if (setting.type === 'select') {
            result.push(field);
        }
    }
    return result;
};

pvt.populateFieldOptions = function (fieldSetting, modelName) {
    var optionModelName = pvt.getOptionModelName(fieldSetting.key, modelName);

    return pvt.getOptions(optionModelName, '_id name').then(function (options) {
        fieldSetting.options = options;
    });
};

pvt.getOptionModelName = function (pathName, modelName) {
    var schema = mongoose.model(modelName).schema;
    var schemaType = schema.path(pathName);

    return schemaType.options.ref;
};

pvt.getOptions = function (modelName, selectSpec) {
    var OptionModel = mongoose.model(modelName);
    var optionsQuery = OptionModel.find().select(selectSpec);

    return optionsQuery.exec();
};

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
