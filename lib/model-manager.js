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
            var extname = path.extname(file);
            var Model, schemaSetting;
            if (extname === '.json') {
                schemaSetting = require.main.require('./models/' + file);
                Model = pvt.buildModel(schemaSetting);
                buildedModels.push({
                    model: Model.modelName,
                    name:  schemaSetting.name,
                });
            }
        });
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
    var config = { }; 

    var fieldName, field;
    for (fieldName in schemaSetting.schema) {
        field = schemaSetting.schema[fieldName];
        if (field.schemaType === 'String') {
            config[fieldName] = String;
        } else if (field.schemaType.type === "ObjectId") {
            config[fieldName] = {
                type: Schema.Types.ObjectId,
                ref: field.schemaType.ref,
            };
        }
    }

    return Schema(config);
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