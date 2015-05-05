'use strict';

var fieldAttrsPlugin = require.main.require('./models/field-attrs-plugin.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

describe('fieldAttrsPlugin', function () {
    var schema, attrs, Model;
    beforeAll(function () {
        schema = Schema({
            name: String,
            jobTitle: String,
            department: {
                type: Schema.Types.ObjectId,
                ref: 'departments'
            }
        });

        var createAttr = function (name, col, type) {
            return {
                name: name,
                col: col,
                type: type,
            };
        };

        attrs = {
            name: createAttr('姓名', 0),
            jobTitle: createAttr('職稱', 1),
            department: createAttr('部門', 2, 'select'),
        };

        schema.plugin(fieldAttrsPlugin, attrs);
        Model = mongoose.model('model', schema);
    });

    it('should add add some property', function () {
        var jobTitleAttrs = Model.getFieldAttrs('jobTitle');
        expect(jobTitleAttrs.name).toBe('職稱');
    });
    it('should add add key property', function () {
        var jobTitleAttrs = Model.getFieldAttrs('jobTitle');
        expect(jobTitleAttrs.key).toBeDefined();
        expect(jobTitleAttrs.key).toBe('jobTitle');
    });
});
