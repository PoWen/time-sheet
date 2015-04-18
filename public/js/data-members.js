'use strict';

/* globals angular */

var app = angular.module('app', ['ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

app.controller('DataCtrl', ['$scope', '$http', '$q', '$interval', 'uiGridConstants', function ($scope, $http, $q, $interval, uiGridConstants) {
    $scope.members = [];
    $scope.newMember = {};

    // $scope.headers = [
    //         { name: 'name', displayName: '姓名'},
    //         { name: 'jobTitle', displayName: '職稱'},
    // ];

    $scope.gridOptions = {
        enableFiltering: true,
        columnDefs: $scope.headers
    };
    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $scope.saveRow = function (entry) {
        var promise = $http.post('/api/members', entry).then(function (res) {
            var key;
            for (key in res.data.data) {
                entry[key] = res.data.data[key];
            }

            if (res.data.isNew) {
                addRowForNewMember();
            }
        });

        $scope.gridApi.rowEdit.setSavePromise( entry, promise );
    };

    $scope.$watch('gridOptions.columnDefs', function (newValue, oldValue) {
        //for hide _id field
        if (newValue === oldValue) return;

        $scope.gridOptions.columnDefs.forEach(function (col) {
            if (col.name === '_id') {
                col.visible = false;
            }
        });
        $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );

        // another way to do it
        // var idIndex;
        // $scope.gridOptions.columnDefs.forEach(function (col, index) {
        //     if (col.name === '_id') {
        //         idIndex = index;
        //     }
        // });
        // $scope.gridOptions.columnDefs.splice(idIndex, 1);
    });

    var addRowForNewMember = function () {
        $scope.newMember = { };
        $scope.members.push($scope.newMember);
    };

    $http.get('/api/members').then(function (res) {
        $scope.members = res.data;
        addRowForNewMember();
        $scope.gridOptions.data = $scope.members;
    });

}]);