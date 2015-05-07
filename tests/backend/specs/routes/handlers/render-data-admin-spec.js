'use strict';

var renderDataAdmin = require.main.require('./routes/handlers/render-data-admin.js');

describe('render home page', function () {
    it('has title time sheet', function () {
        var req = {};
        req.params = {
            model: 'members'
        };
        var res = {};
        res.render = function (name, data) {
            expect(name).toBe('data-admin');
            expect(data.title).toBe('members');
        };

        spyOn(res, 'render').and.callThrough();

        renderDataAdmin(req, res);

        expect(res.render).toHaveBeenCalled();
    });
});
