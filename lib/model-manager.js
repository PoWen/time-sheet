'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fieldsSettingPlugin = require.main.require('./lib/fields-setting-plugin.js');

var modelManager = { };
modelManager.pvt = { };
var pvt = modelManager.pvt;

var buildedModels = [];

modelManager.getModels = function () {
    return JSON.parse(JSON.stringify(buildedModels));
};

modelManager.loadModels = function () {
    fs.readdir('./models', function (err, files) {
        files.forEach(function (file) {
            pvt.loadModel(file);
        });
    });
};

pvt.loadModel = function (fileName) {
    var Model, schemaSetting;
    if (pvt.isValidModel(fileName)) {
        schemaSetting = require.main.require('./models/' + fileName);
        Model = pvt.buildModel(schemaSetting);
        pvt.recordBuildedModel(Model.modelName, schemaSetting.name);
    }
};

pvt.isValidModel = function (fileName) {
    return path.extname(fileName) === '.json';
};

pvt.recordBuildedModel = function (modelName, displayName) {
    buildedModels.push({
        model: modelName,
        name:  displayName,
    });
};

pvt.buildModel = function (schemaSetting) {
    var schema = pvt.createSchema(schemaSetting);
    var settingMap = pvt.collectFieldSettings(schemaSetting);

    schema.plugin(fieldsSettingPlugin, settingMap);
    var Model = mongoose.model(schemaSetting.model, schema);
    Model.buildFieldSettingMap();
    return Model;
};

pvt.createSchema = function (schemaSetting) {
    var definition = pvt.toMongooseDef(schemaSetting);
    return mongoose.Schema(definition);
};

pvt.toMongooseDef = function (schemaSetting) {
    var definition = {};
    var fieldName, field;
    for (fieldName in schemaSetting.schema) {
        field = schemaSetting.schema[fieldName];
        definition[fieldName] = pvt.adpatToMongooseSchema(field);
    }

    return definition;
};

var typeMap = {
    'String': String,
    'Number': Number,
    'Date': Date,
    'Buffer': Buffer,
    'Boolean': Boolean,
    'Mixed': Schema.Types.Mixed,
    'ObjectId': Schema.Types.ObjectId,
};

pvt.adpatToMongooseSchema = function (field) {
    var def = field.valueDef;

    if (typeof def === 'string') {
        return typeMap[def];
    } else if (Array.isArray(def)) {
        return [typeMap[def[0]]];
    } else if (typeof def === 'object') {
        def.type = pvt.adpatToMongooseSchema({valueDef: def.type});
        return def;
    }
};

pvt.collectFieldSettings = function (schemaSetting) {
    var settingMap = { }; 

    var fieldName, field;
    for (fieldName in schemaSetting.schema) {
        field = schemaSetting.schema[fieldName];
        settingMap[fieldName] = field.setting;
    }

    return settingMap;
};

module.exports = modelManager;