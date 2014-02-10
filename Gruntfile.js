/*
 * grunt-custom-styleguide
 * https://github.com/sullinger/grunt-custom-styleguide
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
      
      styleguide_from_multiple_css_files_using_markdown_test: {
        options: {
          processor: 'markdown',
          source_path: 'test/fixtures'
        },
        files: {
          'tmp/styleguide_from_multiple_css_files_using_markdown_test.html': ['base.css','button.css', 'markdown-test.css'],
        }
      },

      custom_styleguide_processor_test: {
        options:
        {
          processor:
          {
            process: function(stylesheets, outputFile)
            {
              // stylesheets is an object. Each key-value pair consists of
              // the stylesheet filename (key) and the an array of all rules (value)
              // found in the stylesheet file.

              var rules = this.getRulesFromStylesheets(stylesheets);

              // you can do any kind of processing and file handling here
              grunt.file.write(outputFile, JSON.stringify(rules, null, 2));
            },

            getRulesFromStylesheets: function(stylesheets)
            {
              var allRules = [];

              var processRule = function(rule)
              {
                rule.stylesheet = sheet;
                return rule;
              };

              // grab all rules from the stylesheets
              for (var sheet in stylesheets)
              {
                var rules = stylesheets[sheet].rules;

                rules = rules.map(processRule);

                allRules = allRules.concat(rules);
              }

              return allRules;
            }

          }
        },
        files:
        {
          'tmp/custom_styleguide_processor_test.html': ['test/fixtures/base.css','test/fixtures/button.css'],
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
