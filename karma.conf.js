module.exports = function(config){
  config.set({

    basePath : './',

    files : [
            'public/js/**/!(*[Ss]pec).js',
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
