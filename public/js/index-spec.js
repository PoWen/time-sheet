'use strict';

/* global inject */

describe('app module', function () {
    //var module;
    beforeEach(function () {
        module('app');
    });

    //beforeEach(module('app'));

    it('should be registered', function () {
        expect(module).toBeDefined();
    });

    it('should say good', inject(function (charles) {
        expect(charles).toBe('good');
    }));
});
