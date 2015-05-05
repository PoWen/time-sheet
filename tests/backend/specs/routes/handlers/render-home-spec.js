'use strict';

var renderHomePage = require.main.require('./routes/handlers/render-home.js');

describe('render home page', function () {
    it('has title time sheet', function () {
        var req = {};
        var res = {};
        res.render = function (name, data) {
            expect(name).toBe('index');
            expect(data.title).toBe('Time Sheet');
        }; 

        spyOn(res, 'render').and.callThrough();

        renderHomePage(req, res);

        expect(res.render).toHaveBeenCalled();
    });
});