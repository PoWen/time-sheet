'use strict';

var Jasmine = require('jasmine');

var jsm = new Jasmine();
jsm.loadConfigFile('./tests/support/jasmine.json');
jsm.execute();
