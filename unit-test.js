'use strict';

var Jasmine = require('jasmine');

var jsm = new Jasmine();
jsm.loadConfigFile('./tests/backend/jasmine.json');
jsm.execute();
