'use strict';

/* global define */

define(function (require) {
    var angular = require('angular');
    require('angular-mocks');
    require('public/js/index');

    var module = angular.mock.module;
    var inject = angular.mock.inject;

    describe('index module', function () {
        beforeEach(module('index'));

        var $injector, $scope;
        beforeEach(inject(function (_$injector_) {
            $injector = _$injector_;

            var $controller = $injector.get('$controller');
            var $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();

            $controller('IndexCtrl', {
                $scope: $scope,
            });
        }));

        it('should be registered', function () {
            expect($scope.charles).toBe('good');
        });

        it('should say good', inject(function (charles) {
            expect(charles).toBe('good');
        }));
    });
});
