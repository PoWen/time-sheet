module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            app: ['<%= pkg.main %>', 'public/js/**/*.js', 'routes/**/*.js', 'lib/**/*.js'],
            options: {
                jshintrc: 'jshint.json'
            },
            qa: {
                options: {
                    jshintrc: 'jshint.json'  
                },
                files: {
                    src: ['Gruntfile.js', 'public/qa/**/*.js']
                }
            }
        },
        exec: {
            jasmine: {
                cmd: 'node tests/jasmine.js'
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
        'grunt-protractor-runner',
        'grunt-exec'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('default', ['jshint', 'exec', 'protractor:all']);
};
