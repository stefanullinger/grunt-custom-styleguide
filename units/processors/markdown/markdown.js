/*
 * grunt-custom-styleguide
 * https://github.com/stefan/grunt-custom-styleguide
 *
 * Copyright (c) 2014 Stefan Ullinger
 * Licensed under the MIT license.
 */

'use strict';

var extend = require('node.extend');
var Twig = require('twig');
var path = require('path');

module.exports = function(grunt, inherit, GruntCustomStylesheetProcessor) {

  return inherit(GruntCustomStylesheetProcessor, {

    __constructor: function(options) {
      this.__base(options);

      this.marked = require('marked');
      this.marked.setOptions(extend({ sanitize: false, gfm: true }, this.options.marked_options || {}));

      this.blockDefinition = {
        type: 'undefined',
        content: '',
        rawContent: ''
      };
    },

    process: function(stylesheets, outputFile) {

      var rules = this.getRulesFromStylesheets(stylesheets);
      var blocks = this.getBlocksFromRules(rules);

      var data = {
        stylesheets: Object.keys(stylesheets),
        blocks: blocks
      };
      
      this.outputBlocks(data, outputFile);

    },

    getRulesFromStylesheets: function(stylesheets) {
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
    },

    getBlocksFromRules: function(rules) {
      var blocks = [];

      // loop through all the rules
      for (var i = 0; i < rules.length; i++) {
        
        var rule = rules[i];

        switch ( rule.type ) {
          
          // if there are comments, handle them
          case "comment":
            blocks = blocks.concat( [ this.getCommentStartBlock() ] );
            blocks = blocks.concat( this.getBlocksFromCommentRule(rule) );
            blocks = blocks.concat( [ this.getCommentEndBlock() ] );
            break;
        }

      }

      return blocks;
    },

    getCommentStartBlock: function() {
      var block = extend({}, this.blockDefinition, {
        type: 'commentStart',
        content: '<div class="styleguide-comment">'
      });

      return block;
    },

    getCommentEndBlock: function() {
      var block = extend({}, this.blockDefinition, {
        type: 'commentEnd',
        content: '</div>'
      });

      return block;
    },

    getCodeDemoHTML: function(html) {
      return '<div class="styleguide-codeDemo"' + html + '</div>'
    },

    getBlocksFromCommentRule: function(rule) {
      var blocks = [];

      var tokens = this.marked.lexer(rule.comment);
      
      for (var i = 0; i < tokens.length; i++) {
        
        var token = tokens[i];
        
        var tokensArray = [ token ];
        tokensArray.links = tokens.links; // Tokens array requires a `links` property.

        var block = extend( {}, this.blockDefinition, {
          type: token.type,
          content: this.marked.parser(tokensArray),
          rawContent: token.text
        });

        var additionalBlocksBeforeCurrentBlock = [];
        var additionalBlocksAfterCurrentBlock = [];

        switch (token.type) {
          case "code":
            // create another block for a code demo

            var codeExampleToken = {
              type: 'html',
              text: this.getCodeDemoHTML(token.text)
            };

            var exampleTokensArray = [codeExampleToken];
            exampleTokensArray.links = tokens.links; // Tokens array requires a `links` property.

            var codeExampleBlock = extend({}, this.blockDefinition, {
              type: 'html',
              content: this.marked.parser(exampleTokensArray),
              rawContent: codeExampleToken.text
            });

            additionalBlocksBeforeCurrentBlock.push(codeExampleBlock);
            break;

          case "heading":
            block.depth = token.depth;
            break;
        }

        blocks = blocks.concat(additionalBlocksBeforeCurrentBlock);
        blocks.push( block );
        blocks = blocks.concat(additionalBlocksAfterCurrentBlock);

        //console.log( JSON.stringify(token, null, 2) );
      };

      return blocks;
    },

    outputBlocks: function(data, outputFile) {

      var template = Twig.twig({
        path: this.options.templateFile || path.join(__dirname, 'styleguide.twig'),
        async: false
      });

      grunt.file.write(outputFile, template.render(data));
      //console.log( JSON.stringify(blocks, null, 2) );

    }

  });

}