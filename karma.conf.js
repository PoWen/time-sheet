'use strict';

module.exports = function(config){
  config.set({

    basePath : './',

    files : [
            'public/lib/jquery/dist/jquery.js',
            'public/lib/bootstrap/dist/js/bootstrap.js',
            'public/lib/angular/angular.js',
            'public/lib/angular-ui-grid/ui-grid.js',
            'public/js/**/*.js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/tests/**/*[Ss]pec.js',
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
    ],
  });
};
