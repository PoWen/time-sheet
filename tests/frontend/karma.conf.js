'use strict';

module.exports = function (config) {
    config.set({
        basePath: '../..',

        preprocessors: {
            '**/*.html': ['ng-html2js'],
            '**/*.json': ['ng-html2js'],
        },

        files: [
            { pattern: 'public/js/**/*.js', included: false },
            { pattern: 'public/lib/**/*.js', included: false },
            { pattern: 'public/lib/**/*.map', included: false },
            { pattern: 'tests/frontend/**/*.js', included: false },
            'test-main.js'
        ],

        exclude: [
            'public/js/main.js',
        ],

        autoWatch: true,

        frameworks: ['jasmine', 'requirejs'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-requirejs',
        ],
    });
};
