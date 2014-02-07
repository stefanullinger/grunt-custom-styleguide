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
  var extend = require('node.extend');

  // **********
  // GruntCustomStyleguideProcessor
  // **********
  var GruntCustomStyleguideProcessor = inherit({
    
    __constructor: function(options) {
        this.options = extend(true, {}, options);
    },

    process: function(stylesheets, outputFile) {}

  });

  return GruntCustomStyleguideProcessor;

};