var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'jquery': 'public/lib/jquery/dist/jquery.min',
    'bootstrap': 'public/lib/bootstrap/dist/js/bootstrap.min',
    'angular': 'public/lib/angular/angular.min',
    'angular-sanitize': 'public/lib/angular-sanitize/angular-sanitize.min',
    'angular-ui-select': 'public/lib/angular-ui-select/dist/select.min',
    'angular-ui-grid': 'public/lib/angular-ui-grid/ui-grid',
    'angular-mocks': 'public/lib/angular-mocks/angular-mocks'
  },
  shim: {
    'bootstrap': ['jquery'],
    'angular': {
      deps: ['jquery'],
      exports: 'angular',
    },
    'angular-sanitize': ['angular'],
    'angular-ui-select': ['angular'],
    'angular-ui-grid': ['angular'],
    'angular-mocks': {
      deps: ['angular'],
      exports: 'angular.mock',
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});