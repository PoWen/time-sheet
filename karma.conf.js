'use strict';

module.exports = function(config){
  config.set({

    basePath : './',

    files : [
            'public/lib/jquery/dist/jquery.min.js',
            'public/lib/bootstrap/dist/js/bootstrap.min.js',
            'public/lib/angular/angular.min.js',
            'public/js/**/!(*[Ss]pec).js',
            'public/lib/angular-mocks/angular-mocks.js',
            'public/js/**/*[Ss]pec.js',
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
