'use strict';

var express = require('express');
var router = express.Router();

var dbManager = require.main.require('./lib/db-manager.js');

router.get('/run', function (req, res) {
    var clone = function (a) {
        return JSON.parse(JSON.stringify(a));
    };

    var Member = dbManager.getDbModel('members');
    var Department = dbManager.getDbModel('departments');

    var adminQuery = Department.findOne({ name: 'Admin' });
    var developeQuery = Department.findOne({ name: 'Develope' });
    var charlesQuery = Member.findOne({ name: 'Charles' });
    var jeffQuery = Member.findOne({ name: 'Jeff' });

    var admin, develope, charles, jeff;
    var result = [];
    var promise = adminQuery.exec().then(function (doc) {
        admin = doc;
        return developeQuery.exec();
    }).then(function (doc) {
        develope = doc;
        return charlesQuery.exec();
    }).then(function (doc) {
        charles = doc;
        charles.department = admin._id;
        return charles.save();
    }).then(function () {
        return jeffQuery.exec();
    }).then(function (doc) {
        jeff = doc;
        jeff.department = develope._id;
        return jeff.save();
    }).then(function () {
        result.push(clone(charles));
        result.push(clone(jeff));

        var opts = {
            path: 'department',
            select: 'name'
        };

        return charles.populate(opts).execPopulate();
    }).then(function () {
        result.push(charles);

        admin.members = [];
        admin.members.push(charles);
        admin.members.push(jeff);
        return admin.save();
    }).then(function () {
        result.push(clone(admin));
        var opts = {
            path: 'members',
            select: 'name'
        };
        return admin.populate(opts).execPopulate();
    }).then(function () {
        result.push(clone(admin));
        result.push(admin.members[0].name);
        admin.members[0].name = 'isaddo';
        result.push(admin.members[0].name);
        return admin.save();
    }).then(function () {
        result.push(admin);
        return jeff.populate('department').execPopulate();
    }).then(function () {
        result.push(jeff);

        var memberSchema = Department.schema;
        result.push(memberSchema);
        memberSchema.eachPath(function (pathName) {
            var path = memberSchema.path(pathName);
            result.push([path.path, Department.getName(pathName), path.instance === 'ObjectID']);
        });
    });

    promise.then(function () {
        res.json(result);
    }).end();
});

module.exports = router;