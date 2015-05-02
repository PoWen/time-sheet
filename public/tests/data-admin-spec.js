'use strict';

/* global inject */

describe('dataAdmin module', function () {
    beforeEach(module('dataAdmin'));

    var $injector, $scope, $window;

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
    }));

    it('call getModelName and getData when init', function () {
        spyOn($scope.pvt, 'getModelName').and.callThrough();

        var $q = $injector.get('$q');
        spyOn($scope.pvt, 'getData').and.returnValue($q.defer().promise);

        $scope.pvt.init();

        expect($scope.pvt.getModelName).toHaveBeenCalledWith('/data/members');
        expect($scope.pvt.getData).toHaveBeenCalledWith('members');
    });

    describe('getData', function () {
        var $httpBackend;
        var mockResponseData = {
            config: {
                fields: {
                    __v: { },
                    _id: { },
                    department: { name: "部門", col: 2, type: "select" },
                    jobTitle: { name: "職稱", col: 1 },
                    name: { name: "姓名", col: 0 },
                },
                model: 'members',
            },
            data: [
                {_id: "553729784bc9ee9e7e9d84de", name: "Charles", jobTitle: "CFO"},
                {_id: "553729784bc9ee9e7e9d84df", name: "Ernie", jobTitle: "CTO"},
                {_id: "553729784bc9ee9e7e9d84e0", name: "Jeff", jobTitle: "Staff"},
            ],
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

            $scope.pvt.getData('members').then(function (data) {
                expect(data).toEqual(mockResponseData);
            });

            $httpBackend.flush();
        });

        it('assign data to model after getDataDone', function () {
            $scope.pvt.assignDataToModel(mockResponseData.data);

            expect($scope.docs).toEqual(mockResponseData.data);
            expect($scope.gridOptions.data).toEqual(mockResponseData.data);
        });

        it('build columnDefs', function () {
            $scope.pvt.buildColumnDefs(mockResponseData.config);

            var target = [
                { name: 'name', field: 'name', displayName: '姓名'},
                { name: 'jobTitle', field: 'jobTitle', displayName: '職稱' },
                { name: 'department', field: 'department', displayName: '部門'},
            ];

            expect($scope.gridOptions.columnDefs).toEqual(target);
        });

        it('add an empty row for insert data after getDataDone', function () {
            $scope.docs = mockResponseData.data;
            $scope.pvt.addEmptyRowForInsertDoc();

            expect($scope.docs.length).toBe(4);
            expect($scope.docs[3]).toEqual({ });
        });
    });

    //設定好 grid option
});