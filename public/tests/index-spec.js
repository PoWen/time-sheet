'use strict';

/* global inject */

describe('index module', function () {
    beforeEach(function () {
        module('index');
    });

    it('should be registered', function () {
        expect(module).toBeDefined();
    });

    it('should say good', inject(function (charles) {
        expect(charles).toBe('good');
    }));
});