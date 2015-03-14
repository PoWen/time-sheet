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
                cmd: 'jasmine'
            }
        }
    });

    [
        'grunt-contrib-jshint',
        'grunt-exec'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    grunt.registerTask('default', ['jshint', 'exec']);
};
