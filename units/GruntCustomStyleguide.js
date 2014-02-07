/*
 * grunt-custom-styleguide
 * https://github.com/stefan/grunt-custom-styleguide
 *
 * Copyright (c) 2014 Stefan Ullinger
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var inherit = require('inherit');
  var parse = require('css-parse');
  var extend = require('node.extend');

  var DEFAULT_OPTIONS = {
    processor: false,
    inheritFromBuiltInProcessor: false
  };


  // **********
  // GruntCustomStyleguide
  // **********
  var GruntCustomStyleguide = inherit( {

    __constructor : function(options) {
      this.options = extend(true, {}, DEFAULT_OPTIONS, options);
      this.processors = {};
    },

    registerProcessor : function(id, processorObject) {
      this.processors[ id ] = processorObject;
    },

    parseStylesheet : function(file) {
      var stylesheetContent = this._getStylesheetContent(file);

      var parsedFile = parse(stylesheetContent);

      if (false === parsedFile ||
          false === parsedFile.stylesheet ||
          false === parsedFile.stylesheet.rules) {
        grunt.fail.fatal("Could not parse CSS for " + file);
      }

      return parsedFile.stylesheet.rules;
    },

    _getStylesheetContent : function(file) {
      if (grunt.file.isFile(file)) {
        return grunt.file.read(file);
      }
      else if (typeof file === "string") {
        return file;
      }

      return '';
    }

  });

  return GruntCustomStyleguide;

};