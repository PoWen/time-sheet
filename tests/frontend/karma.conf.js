'use strict';

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'requirejs'],

        plugins: [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor',
            'karma-requirejs',
        ],

        // 因為把 tests 跟 public 分開放
        // 為了讀取 tests 所以設定 basePath 到 project root
        // 若是設定到 /public ，要用 ../tests/ 來取讀測試
        // 在 karma 設定下會變成絕對路徑，在 requirejs 下會有問題
        basePath: '../..',

        // included: false 表示不用 script tag 匯入，由 requirejs 匯入
        files: [
            { pattern: 'public/requirejs-config.js', included: false },
            { pattern: 'public/lib/**/*.js', included: false },
            { pattern: 'public/lib/**/*.map', included: false },
            { pattern: 'public/js/**/*.js', included: false },
            { pattern: 'tests/frontend/mocks/**/*.js', included: false },
            { pattern: 'tests/frontend/specs/**/*.js', included: false },
            { pattern: 'tests/frontend/test-main.js', included: true },
        ],

        exclude: [
            'public/js/main.js',
        ],

        preprocessors: {
            '**/*.html': ['ng-html2js'],
            '**/*.json': ['ng-html2js'],
        },

        autoWatch: true,

        browsers: ['Chrome'],
    });
};
