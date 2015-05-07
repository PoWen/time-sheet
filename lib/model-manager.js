'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelManager = { };
modelManager.pvt = { };
var pvt = modelManager.pvt;


modelManager.loadModels = function () {
    fs.readdir('./models', function (err, files) {
        files.forEach(function (file) {
            var extname = path.extname(file);
            if (extname === '.json') {
                pvt.buildModel(require.main.require('./models/' + file));
            }
        });
    });
};

var fieldsSettingPlugin = require.main.require('./models/fields-setting-plugin.js');

pvt.buildModel = function (schemaSetting) {
    var schema = pvt.createSchema(schemaSetting);
    var settingMap = pvt.collectFieldSettings(schemaSetting);

    schema.plugin(fieldsSettingPlugin, settingMap);
    var Model = mongoose.model(schemaSetting.name, schema);
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