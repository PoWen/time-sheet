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

dataAdmin.filter('options', [function () {
    return function (input, options) {
        return options[input];
    };
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

            column = pvt.adaptToColumnDef(field);
            if (column !== null) {
                columns[field.col] = column;
            }
        }

        $scope.gridOptions.columnDefs = columns;
    };

    $scope.fieldOptions = {};

    pvt.adaptToColumnDef = function (field) {
        if (!isVisible(field)) return null;

        var column = {};
        column.name = field.key;
        column.displayName = field.name;

        if (field.type === 'select') {
            column.field = field.key;
            column.editableCellTemplate = 'ui-grid/dropdownEditor';
            column.editDropdownOptionsArray = pvt.adaptToDropdownOptions(field.options);
            $scope.fieldOptions[field.key] = pvt.converToOptionMap(field.options);
            column.cellFilter = 'options:grid.appScope.fieldOptions.' + field.key;
        } else {
            column.field = field.key;
        }

        return column;
    };
    pvt.adaptToDropdownOptions = function (fieldOptions) {
        return fieldOptions.map(function (option) {
            return {
                id: option._id,
                value: option.name,
            };
        });
    };
    pvt.converToOptionMap = function (fieldOptions) {
        return fieldOptions.reduce(function (prev, current) {
            prev[current._id] = current.name;
            return prev;
        }, { });
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

    starter.init();
}]);