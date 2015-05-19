'use strict';

/* globals define, document */

define(function (require) {
    require('jquery');
    require('bootstrap');
    var angular = require('angular');
    require('angular-sanitize');
    require('angular-ui-select');
    require('angular-ui-grid');

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

    dataAdmin.filter('map', [function () {
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
        ['uiGridConstants', 'uiGridEditConstants', '$timeout',
            function (uiGridConstants, uiGridEditConstants, $timeout){

        return {
            scope: true,
            compile: function () {
                return {
                    pre: function () {
                    },
                    post: function ($scope, $elm) {
                        $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function() {
                            $elm[0].style.width = ($elm[0].parentElement.offsetWidth - 1) + 'px';

                            $scope.uiSelect = angular.element($elm[0]).controller('uiSelect');
                            $scope.uiSelect.setFocus();
                            $timeout(function () {
                                $scope.uiSelect.activate();
                            });

                            $scope.stopEdit = function() {
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
                    post: function ($scope, $elm) {
                        $scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function() {
                            $elm[0].style.width = ($elm[0].parentElement.offsetWidth - 1) + 'px';

                            $scope.uiSelect = angular.element($elm[0]).controller('uiSelect');
                            $scope.uiSelect.setFocus();
                            $scope.uiSelect.activate();

                            $scope.stopEdit = function() {
                                $scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
                            };
                        });

                        $scope.clearInput = function () {
                            $scope.uiSelect.search = '';
                            $scope.uiSelect.setFocus();
                            $scope.uiSelect.activate();
                        };
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

        $scope.optionMaps = {};
        pvt.adaptToColumnDef = function (field) {
            if (!isVisible(field)) return null;

            var column = {};
            column.name = field.key;
            column.displayName = field.name;
            column.field = field.key;

            if (field.type === 'select') {
                column.filter = { };
                column.filter.type = uiGridConstants.filter.SELECT;
                column.filter.selectOptions = pvt.adaptToFilterOptions(field.options);

                $scope.optionMaps[field.key] = pvt.convertToOptionMap(field.options);
                column.cellFilter = 'map:grid.appScope.optionMaps.' + field.key;

                column.editableCellTemplate = $templateCache.get('select-editor.html');
                column.editDropdownOptionsArray = pvt.adaptToDropdownOptions(field.options);
            } else if (field.type === 'multiselect') {
                column.filter = { };
                column.filter.condition = uiGridConstants.filter.CONTAINS;
                column.filter.type = uiGridConstants.filter.SELECT;
                column.filter.selectOptions = pvt.adaptToFilterOptions(field.options);

                $scope.optionMaps[field.key] = pvt.convertToOptionMap(field.options);
                column.cellFilter = 'map:grid.appScope.optionMaps.' + field.key;

                column.editableCellTemplate = $templateCache.get('multiselect-editor.html');
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
        pvt.convertToOptionMap = function (fieldOptions) {
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
            gridApi.cellNav.on.navigate($scope, function() {
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

    var $html = angular.element(document.getElementsByTagName('html')[0]);
    angular.element($html).ready(function() {
        angular.bootstrap(document, ['dataAdmin']);
    });
});

