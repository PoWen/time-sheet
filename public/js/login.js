'use strict';

/* globals angular */

var app = angular.module('app', ['ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

app.controller('DataCtrl', ['$scope', '$http', '$window', 'uiGridConstants', function ($scope, $http, $window, uiGridConstants) {
    $scope.docs = [];
    $scope.toInsertDoc = {};

    var path = $window.location.pathname;
    var modelName = path.split('/').pop();

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
        gridApi.rowEdit.on.saveRow($scope, $scope.saveDoc);
    };

    $scope.saveDoc = function (doc) {
        var promise = $http.post('/api/' + modelName, doc).then(function (res) {
            var key;
            for (key in res.data.data) {
                doc[key] = res.data.data[key];
            }

            if (res.data.isNew) {
                addRowForInsertDoc();
            }
        });

        $scope.gridApi.rowEdit.setSavePromise( doc, promise );
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

    var addRowForInsertDoc = function () {
        $scope.toInsertDoc = { };
        $scope.docs.push($scope.toInsertDoc);
    };

    $http.get('/api/' + modelName).then(function (res) {
        $scope.docs = res.data;
        addRowForInsertDoc();
        $scope.gridOptions.data = $scope.docs;
    });

}]);