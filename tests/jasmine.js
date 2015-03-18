var Jasmine = require('jasmine');

var jasmine = new Jasmine();
jasmine.loadConfigFile('./tests/jasmine.json');
jasmine.execute();
