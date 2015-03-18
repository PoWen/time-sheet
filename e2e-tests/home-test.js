describe('time-sheet home page', function () {
    browser.get('');

    it('should have correct title', function () {
        expect(browser.getTitle()).toEqual('Time Sheet');
    });
});
