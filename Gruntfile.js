'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            app: [
                    '<%= pkg.main %>', 
                    'public/js/**/*.js', 
                    'routes/**/*.js', 
                    'lib/**/*.js',
                    'models/**/*.js'
            ],
            options: {
                jshintrc: 'jshint.json'
            },
            qa: {
                options: {
                    jshintrc: 'jshint.json'  
                },
                files: {
                    src: [
                            '*.js',
                            'tests/**/*.js',
                            'e2e-tests/**/*.js',
                    ]
                }
            }
        },
        exec: {
            jasmine: {
                cmd: 'node tests/jasmine.js'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
            },
            build: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        protractor: {
            options: {
                configFile: "e2e-tests/protractor.conf.js",
                keepAlive: true
            },
            all: {}
        }
    });

    [
        'grunt-contrib-jshint',
        'grunt-exec',
        'grunt-karma',
        'grunt-protractor-runner'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('default', ['jshint', 'exec', 'karma:build', 'protractor:all']);
};
