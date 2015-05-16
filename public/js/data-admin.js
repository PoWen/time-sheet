'use strict';

/* globals angular */

var dataAdmin = angular.module('dataAdmin', [
        'ngSanitize', 'ui.select', 
        'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav']);

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
        if (Array.isArray(input)) {
            return input.map(function (value) {
                return options[value];
            }).join(', ');
        } else {
            return options[input];
        }
    };
}]);

dataAdmin.directive('myDropdown',
    ['uiGridConstants', 'uiGridEditConstants',
        function (uiGridConstants, uiGridEditConstants){

    return {
        scope: true,
        compile: function () {
            return {
                pre: function () {
                },
                post: function ($scope, $elm, $attrs) {
                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function() {
                        $elm[0].style.width = ($elm[0].parentElement.offsetWidth - 1) + 'px';

                        // focus the focusser, putting focus onto select but without opening the dropdown
                        var uiSelect = angular.element($elm[0]).controller('uiSelect');
                        uiSelect.focusser[0].focus();

                        $scope.stopEdit = function(evt) {
                            $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                        };
                    });
                }
            };
        }
    };
}]);

dataAdmin.directive('myMultiselect',
    ['uiGridConstants', 'uiGridEditConstants',
        function (uiGridConstants, uiGridEditConstants){

    return {
        scope: true,
        compile: function () {
            return {
                pre: function () {
                },
                post: function ($scope, $elm, $attrs) {
                    $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function() {
                        $elm[0].style.width = ($elm[0].parentElement.offsetWidth - 1) + 'px';

                        $scope.stopEdit = function(evt) {
                            $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                        };
                    });
                }
            };
        }
    };
}]);

dataAdmin.controller('DataCtrl',
        ['$scope', '$http', '$window', '$timeout', 'uiGridConstants', 'uiGridEditConstants', 'starter', '$templateCache',
        function ($scope, $http, $window, $timeout, uiGridConstants, uiGridEditConstants, starter, $templateCache) {

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

    $scope.models = [];

    pvt.init = function () {
        modelName = pvt.getModelName($window.location.pathname);
        pvt.getModels().then(function (models) {
            $scope.models = models;
        });
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
        column.field = field.key;

        var selectTemplate = $templateCache.get('select-editor.html');
        var multiselectTemplate = $templateCache.get('multiselect-editor.html');

        if (field.type === 'select') {
            column.filter = { };
            column.filter.type = uiGridConstants.filter.SELECT;
            column.filter.selectOptions = pvt.adaptToFilterOptions(field.options);

            $scope.fieldOptions[field.key] = pvt.converToOptionMap(field.options);
            column.cellFilter = 'options:grid.appScope.fieldOptions.' + field.key;

            column.editableCellTemplate = selectTemplate;
            column.editDropdownOptionsArray = pvt.adaptToDropdownOptions(field.options);

        } else if (field.type === 'multiselect') {
            column.filter = { };
            column.filter.condition = uiGridConstants.filter.CONTAINS;
            column.filter.type = uiGridConstants.filter.SELECT;
            column.filter.selectOptions = pvt.adaptToFilterOptions(field.options);

            $scope.fieldOptions[field.key] = pvt.converToOptionMap(field.options);
            column.cellFilter = 'options:grid.appScope.fieldOptions.' + field.key;

            column.editableCellTemplate = multiselectTemplate;
            column.editDropdownOptionsArray = pvt.adaptToDropdownOptions(field.options);
        }

        return column;
    };
    var isVisible = function (field) {
        return !!field.name;
    };
    pvt.adaptToFilterOptions = function (fieldOptions) {
        return fieldOptions.map(function (option) {
            return {
                value: option._id,
                label: option.name,
            };
        });
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
        gridApi.cellNav.on.navigate($scope, function(newRowCol, oldRowCol) {
            $scope.$broadcast(uiGridEditConstants.events.END_CELL_EDIT);
        });
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

    pvt.getModels = function () {
        return $http.get('/api/get-models').then(function (res) {
            return res.data;
        });
    };

    starter.init();
}]);