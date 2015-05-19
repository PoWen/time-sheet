'use strict';

/* globals define */

require(['requirejs-config'], function (config) {
    require.config(config);
    
    switch (document.location.pathname) {
        case '/':
            require(['js/index']);
            break;
        default:
            require(['js/data-admin']);
            break;
    }
});

