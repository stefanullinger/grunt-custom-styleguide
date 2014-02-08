/*
 * grunt-custom-styleguide
 * https://github.com/stefan/grunt-custom-styleguide
 *
 * Copyright (c) 2014 Stefan Ullinger
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var GruntCustomStyleguide = require('../units/GruntCustomStyleguide.js')(grunt);
  var inherit = require('inherit');
  var extend = require('node.extend');
  var path = require('path');
  var GruntCustomStyleguideProcessor = require('../units/GruntCustomStyleguideProcessor.js')(grunt);
  

  // **********
  // Built-in processors
  // **********
  var processorsPath = '../units/processors/';
  var MarkdownProcessor = require(processorsPath + 'markdown/markdown.js')(grunt, inherit, GruntCustomStyleguideProcessor);

  
  grunt.registerMultiTask('custom_styleguide', 'Creates a styleguide from commented CSS files.', function() {

    var styleguide = new GruntCustomStyleguide( this.options({
      processor: 'markdown'
    }) );

    // register built-in processors
    styleguide.registerProcessor( 'markdown', MarkdownProcessor );

    this.files.forEach(function(file) {

      var stylesheets = {};

      file.orig.src.forEach(function(filepath) {

        stylesheets[filepath] = {
          rules: styleguide.parseStylesheet(path.join(styleguide.options.source_path || '', filepath))
        };
      });

      var Processor = styleguide.options.processor;
      var processorType = typeof Processor;

      if ( processorType === 'string' ) {
        Processor = styleguide.processors[ Processor ] ||Processor;
      }
      else
      {
        // create a custom processor that inherits from GruntCustomStyleguideProcessor
        // this makes sure that some basic functions are defined

        var inheritFrom = GruntCustomStyleguideProcessor;

        var builtInProcessorToInheritFrom = styleguide.options.inheritFromBuiltInProcessor;
        
        if (typeof builtInProcessorToInheritFrom === 'string') {
          if (typeof styleguide.processors[ builtInProcessorToInheritFrom ] !== 'undefined') {
            inheritFrom = styleguide.processors[ builtInProcessorToInheritFrom ];
          }
          else {
            grunt.fail.fatal("Built-in processor '" + builtInProcessorToInheritFrom + "' not found. The built-in processors are " + Object.keys(styleguide.processors));
          }
        }

        Processor = inherit(inheritFrom, Processor);
      }

      if ( typeof Processor === 'string' ) {
        grunt.fail.fatal("Please define a processor to use. Either define a custom processor or use one of the built-in processors: " + Object.keys(styleguide.processors));
      }

      // instantiate processor
      var processorInstance = new Processor();
      processorInstance.process(stylesheets, file.dest);

    });   

  });

};
