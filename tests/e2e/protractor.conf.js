exports.config = {
    allScriptsTimeout: 11000,

    specs: [ 'tests/**/*.js' ],

    capabilities: {
        'browserName': 'chrome',
    },

    directConnect: true,
    
    baseUrl: 'http://localhost:3000/',

    rootElement: '.ng-app',

    framework: 'jasmine2',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};
