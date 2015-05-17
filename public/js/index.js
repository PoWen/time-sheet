'use strict';

/* globals define */

define(function (require) {
    var angular = require('angular');

    var index = angular.module('index', []);
    index.constant('charles', 'good');
    index.controller('IndexCtrl', ['$scope', 'charles', function ($scope, charles) {
        $scope.charles = charles;
    }]);
    
    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element($html).ready(function() {
        angular.bootstrap(document, ['index']);
    });
});
