/*
 * grunt-twig2html
 * https://github.com/toptalo/twig2html
 *
 * Copyright (c) 2017 Виктор Виктор
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        twig2html: {
            options: {
                globals: './test/fixtures/globals.json'
            },
            index: {
                options: {
                    context: {
                        year: 2017
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: './test/fixtures/pages/',
                        src: ['**/*.twig'],
                        dest: './tmp/',
                        ext: '.html'
                    }
                ]
            },
            functions: {
                options: {
                    functions: {
                        greeting: function (name) {
                            return 'Hello, ' + name + '!';
                        }
                    },
                    context: {
                        name: 'Victor'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: './test/fixtures/functions/',
                        src: ['**/*.twig'],
                        dest: './tmp/',
                        ext: '.html'
                    }
                ]
            },
            filters: {
                options: {
                    filters: {
                        tel: function (str) {
                            return str.replace(/([^0-9+])/g, '');
                        }
                    },
                    context: {
                        phone: '+7 (999) 888-77-66'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: './test/fixtures/filters/',
                        src: ['**/*.twig'],
                        dest: './tmp/',
                        ext: '.html'
                    }
                ]
            },
            allTogether: {
                options: {
                    filters: {
                        tel: function (str) {
                            return str.replace(/([^0-9+])/g, '');
                        }
                    },
                    functions: {
                        greeting: function (name) {
                            return 'Hello, ' + name + '!';
                        }
                    },
                    context: {
                        name: 'Victor',
                        phone: '+7 (999) 888-77-66',
                        year: 2017
                    }
                },
                files: {
                    './tmp/concat.html': ['./test/fixtures/pages/**/*.twig', './test/fixtures/filters/**/*.twig', './test/fixtures/functions/**/*.twig']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'twig2html', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
