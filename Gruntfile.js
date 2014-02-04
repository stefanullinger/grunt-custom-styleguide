/*
 * grunt-custom-styleguide
 * https://github.com/stefan/grunt-custom-styleguide
 *
 * Copyright (c) 2014 Stefan Ullinger
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    custom_styleguide: {
      basic_process_test: {
        options: {
          process: function(stylesheets, outputPath) {

            var allRules = [];
            
            for (var sheet in stylesheets) {
              allRules = allRules.concat(stylesheets[sheet].rules);
            }

            grunt.file.write(outputPath, JSON.stringify(allRules, null, 2));            
          }
        },
        files: {
          'tmp/basic_process_test.json': ['test/fixtures/simple.css','test/fixtures/buttons.css'],
        },
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'custom_styleguide', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
