'use strict';

/* global inject */

describe('dataAdmin module', function () {
    beforeEach(module('dataAdmin'));

    var $injector, $scope, $window;
    var pvt;

    beforeEach(inject(function (_$injector_) {
        $injector = _$injector_;

        var $controller = $injector.get('$controller');

        var $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

        $window = { };
        $window.location = { };
        $window.location.pathname = '/data/members';

        //prevent running init when controller created
        var starter = $injector.get('starter');
        spyOn(starter, 'init');

        $controller('DataCtrl', {
            $scope: $scope,
            $window: $window,
            starter: starter,
        });

        pvt = $scope.pvt;
    }));

    it('call getModelName and getData when init', function () {
        spyOn(pvt, 'getModelName').and.callThrough();

        var $q = $injector.get('$q');
        spyOn(pvt, 'getData').and.returnValue($q.defer().promise);

        pvt.init();

        expect(pvt.getModelName).toHaveBeenCalledWith('/data/members');
        expect(pvt.getData).toHaveBeenCalledWith('members');
    });

    describe('getData', function () {
        var mockData = [
            {
                "_id": "5542437cf79f7879d4048581",
                "name": "Charles",
                "jobTitle": "CEO",
                "department": {
                    "_id": "5540bf94721b2f7c1660fa8f",
                    "name": "Admin"
                }
            }, {
                "department": null,
                "_id": "5542437cf79f7879d4048582",
                "name": "Ernie",
                "jobTitle": "CTO"
            }, {
                "_id": "5542437cf79f7879d4048583",
                "name": "Steven",
                "jobTitle": "Staff",
                "department": {
                    "_id": "5540d784967634701b47b107",
                    "name": "Develope"
                }
            }
        ];
        var mockConfig = {
            fields: {
                __v: {},
                _id: {},
                department: {key: 'department', name: '部門', col: 2, type: 'select'},
                name: {key: 'name', name: '姓名', col: 0 },
                jobTitle: {key: 'jobTitle', name: '職稱', col: 1 },
            },
            model: 'members',
        };
        var $httpBackend;
        var mockResponseData = {
            config: mockConfig,
            data: mockData,
        };

        beforeEach(function () {
            $httpBackend = $injector.get('$httpBackend');
            $httpBackend.whenGET('/api/members').respond(mockResponseData);
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('get data from api/:modelName', function () {
            $httpBackend.expectGET('/api/members');

            pvt.getData('members').then(function (data) {
                expect(data).toEqual(mockResponseData);
            });

            $httpBackend.flush();
        });

        it('assign data to model after getDataDone', function () {
            pvt.assignDataToModel(mockResponseData.data);

            expect($scope.docs).toEqual(mockResponseData.data);
            expect($scope.gridOptions.data).toEqual(mockResponseData.data);
        });

        it('build columnDefs', function () {
            pvt.buildColumnDefs(mockResponseData.config);

            var target = [
                { name: 'name', field: 'name', displayName: '姓名'},
                { name: 'jobTitle', field: 'jobTitle', displayName: '職稱' },
                { name: 'department', field: 'department.name', displayName: '部門'},
            ];

            expect($scope.gridOptions.columnDefs).toEqual(target);
        });

        describe('adaptToColumnDef', function () {
            var testSpecs = [
                {
                    field: { _id: { } },
                    target: null,
                },
                {
                    field: { key: 'jobTitle', name: '職稱', col: 1 },
                    target: { 
                        name: 'jobTitle',
                        field: 'jobTitle',
                        displayName: '職稱',
                    },
                },
                {
                    field: { key: 'department', name: '部門', col: 2, type: 'select' },
                    target: { 
                        name: 'department',
                        field: 'department.name',
                        displayName: '部門',
                    },
                },
            ];

            testSpecs.forEach(function (spec) {
                it('adaptToColumnDef', function () {
                    var columnDef = pvt.adaptToColumnDef(spec.field);
                    expect(columnDef).toEqual(spec.target);
                });
            });
        });

        it('add an empty row for insert data after getDataDone', function () {
            $scope.docs = mockResponseData.data;
            pvt.addEmptyRowForInsertDoc();

            expect($scope.docs.length).toBe(4);
            expect($scope.docs[3]).toEqual({ });
        });
    });

    //設定好 grid option
});