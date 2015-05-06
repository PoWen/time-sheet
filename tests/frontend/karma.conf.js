'use strict';

module.exports = function (config) {
    config.set({
        basePath: '../..',

        preprocessors: {
            '**/*.html': ['ng-html2js'],
            '**/*.json': ['ng-html2js'],
        },

        files: [
            //lib
            'public/lib/jquery/dist/jquery.js',
            'public/lib/bootstrap/dist/js/bootstrap.js',
            'public/lib/angular/angular.js',
            'public/lib/angular-ui-grid/ui-grid.js',

            //src
            'public/js/**/*.js',

            //assets
            'tests/mocks/**/*.json',

            //tests
            'public/lib/angular-mocks/angular-mocks.js',
            'tests/frontend/mocks/**/*.js',
            'tests/frontend/specs/**/*[Ss]pec.js',

        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
        ],
    });
};
