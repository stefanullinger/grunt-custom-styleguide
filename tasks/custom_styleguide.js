/*
 * grunt-custom-styleguide
 * https://github.com/stefan/grunt-custom-styleguide
 *
 * Copyright (c) 2014 Stefan Ullinger
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var parse = require('css-parse'),

  DEFAULT_OPTIONS = {
    process: false
  };

  function GruntCustomStyleguide(options) {
    this.options = options(DEFAULT_OPTIONS);
  }

  GruntCustomStyleguide.prototype.parseStylesheet = function(file) {
    var stylesheetContent = this._getStylesheetContent(file);

    var parsedFile = parse(stylesheetContent);

    if (false === parsedFile ||
        false === parsedFile.stylesheet ||
        false === parsedFile.stylesheet.rules) {
      grunt.fail.fatal("Could not parse CSS for " + file);
    }

    return parsedFile.stylesheet.rules;
  };

  GruntCustomStyleguide.prototype._getStylesheetContent = function(file)
  {
    if (grunt.file.exists(file)) {
      return grunt.file.read(file);
    }
    else if (typeof file === "string") {
      return file;
    }

    return '';
  };

  
  grunt.registerMultiTask('custom_styleguide', 'Creates a styleguide from commented CSS files.', function() {

    var styleguide = new GruntCustomStyleguide(this.options);

    var stylesheets = {};

    this.files.forEach(function(file) {

      file.src.forEach(function(filepath) { 
        stylesheets[filepath] = {
          rules: styleguide.parseStylesheet(filepath)
        };
      });

      if (false !== styleguide.options.process) {
        styleguide.options.process(stylesheets, file.dest);
      }

    });    

  });

};
