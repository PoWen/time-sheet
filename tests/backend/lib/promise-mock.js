'use strict';

var Q = require('q');

var exports = { };

exports.resolve = function (value) {
    return function () {
        var deferred = Q.defer();
        deferred.resolve(value);
        return deferred.promise;
    };
};

//TODO exports.reject

module.exports = exports;