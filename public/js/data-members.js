'use strict';

/* globals angular */

var app = angular.module('app', []);

app.controller('DataCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.members = [];

    $http.get('/api/members').then(function (res) {
        var members = res.data;
        $scope.members = members;
    });

}]);