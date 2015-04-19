'use strict';

var Jasmine = require('jasmine');

var jsm = new Jasmine();
jsm.loadConfigFile('./tests/jasmine.json');
jsm.execute();
