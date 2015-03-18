/* global testFrontUnitTest */
describe('test front unit test', function () {
    var testString = testFrontUnitTest();

    it('should be good', function () {
        expect(testString).toBe('good');
    });

});
