'use strict';

/* globals angular */

var dataAdmin = angular.module('dataAdmin',
        ['ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

dataAdmin.factory('starter', [function(){
    var that = {};

    var initFn = function () { };

    that.onInit = function (fn) {
        initFn = fn;
    };

    that.init = function () {
        initFn();
    };

    return that;
}]);

dataAdmin.controller('DataCtrl',
        ['$scope', '$http', '$window', '$timeout', 'uiGridConstants', 'starter',
        function ($scope, $http, $window, $timeout, uiGridConstants, starter) {

    $scope.pvt = {};
    var pvt = $scope.pvt;

    $scope.docs = [];
    $scope.toInsertDoc = {};

    $scope.gridOptions = {
        data: $scope.docs,
        enableFiltering: true,
        columnDefs: [],
    };
    
    var modelName = '';

    pvt.init = function () {
        modelName = pvt.getModelName($window.location.pathname);
        return pvt.getData(modelName).then(pvt.getDataDone);
    };
    starter.onInit(pvt.init);

    pvt.getModelName = function (path) {
        return path.split('/').pop();
    };

    pvt.getData = function (modelName) {
        return $http.get('/api/' + modelName).then(function (res) {
            return res.data;
        });
    };

    pvt.getDataDone = function (data) {
        pvt.buildColumnDefs(data.config);
        pvt.assignDataToModel(data.data);
        pvt.addEmptyRowForInsertDoc();
    };

    pvt.buildColumnDefs = function (config) {
        var columns = [ ];

        var name, column, field;
        for (name in config.fields) {
            field = config.fields[name];
            if (isVisible(field)) {
                column = {};
                column.name = name;
                column.field = name;
                column.displayName = field.name;

                if (name === 'department') {
                    column.field = 'department.name';
                }

                columns[field.col] = column;
            }
        }

        $scope.gridOptions.columnDefs = columns;
    };

    pvt.adaptToColumnDef = function (field) {
        if (!isVisible(field)) return null;
    };

    var isVisible = function (field) {
        return !!field.name;
    };

    pvt.assignDataToModel = function (data) {
        $scope.docs = data;
        $scope.gridOptions.data = $scope.docs;
    };

    pvt.addEmptyRowForInsertDoc = function () {
        $scope.toInsertDoc = { };
        $scope.docs.push($scope.toInsertDoc);
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
                pvt.addEmptyRowForInsertDoc();
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

    starter.init();
}]);