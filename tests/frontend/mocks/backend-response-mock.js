'use strict';

/* globals angular */

var backendMockModule = angular.module('backendMock', ['tests/mocks/mock-db-response.json']);

backendMockModule.factory('backendMock', ['$templateCache', function($templateCache) {
    var backendMock = JSON.parse($templateCache.get('tests/mocks/mock-db-response.json'));
    return backendMock;
}]);