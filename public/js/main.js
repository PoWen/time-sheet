'use strict';

/* globals define */

require.config({
    baseUrl: '/',
    paths: {
        'jquery': '/lib/jquery/dist/jquery.min',
        'bootstrap': '/lib/bootstrap/dist/js/bootstrap.min',
        'angular': '/lib/angular/angular.min',
        'angular-sanitize': '/lib/angular-sanitize/angular-sanitize.min',
        'angular-ui-select': '/lib/angular-ui-select/dist/select.min',
        'angular-ui-grid': '/lib/angular-ui-grid/ui-grid',
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
    }
});

define(function (require) {
    switch (document.location.pathname) {
        case '/':
            require(['js/index']);
            break;
        default:
            require(['js/data-admin']);
            break;
    }
});

