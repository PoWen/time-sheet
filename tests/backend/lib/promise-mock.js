'use strict';

var Q = require('q');

var exports = { };

exports.resolvedWith = function (value) {
    var deferred = Q.defer();
    deferred.resolve(value);
    return deferred.promise;
};

//TODO exports.reject

module.exports = exports;