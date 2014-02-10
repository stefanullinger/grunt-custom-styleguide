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

if (typeof String.prototype.endsWith !== 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}

module.exports = function(grunt, inherit, GruntCustomStylesheetProcessor) {

  return inherit(GruntCustomStylesheetProcessor, {

    __constructor: function(options) {
      this.__base(options);

      this.marked = require('marked');
      this.marked.setOptions(extend({ sanitize: false, gfm: true }, this.options.marked_options || {}));

      this.blockDefinition = {
        type: 'undefined',
        content: ''
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
      return '<div class="styleguide-codeDemo">' + html + '</div>'
    },

    getBlocksFromCommentRule: function(rule) {
      var blocks = [];

      var tokens = this.marked.lexer(rule.comment);

      // handle nested lists, blockquotes, etc.
      // nested items must make up a single block, otherwise marked.parser would fail to generate the content
      var collectTokens = false;
      var collectTokensStackSize = 0;
      var collectTokensUntil = '';
      var tokenCollection = false;
      
      for (var i = 0; i < tokens.length; i++)
      {
        var token = tokens[i];

        // if we are not currently collecting, but stumble of a *_start token,
        // start a new collect sequence
        if ( false === collectTokens && token.type.endsWith( '_start' ) )
        {
          collectTokens = true;
          collectTokensStackSize = 0;
          collectTokensUntil = token.type.replace('_start', '_end');
          tokenCollection = [];
        }

        if ( collectTokens === true )
        {
          tokenCollection.push( token );

          // check for nested tokens ... compare the current token
          // with the start token of this collection sequence
          // if they match, increase the stack size, so we can find out
          // when this collection of nested tokens is done

          if ( token.type === collectTokensUntil.replace('_end', '_start') ) {
            collectTokensStackSize++;
          }

          if ( token.type === collectTokensUntil ) {
            collectTokensStackSize--;

            // do not finish this collection sequence,
            // until we've found the real *_end token
            if (collectTokensStackSize <= 0) {
              collectTokens = false;
              collectTokensUntil = '';
            }
          }
        }
        
        // whenever outside of a collection sequence, create a block
        if ( collectTokens === false )
        {
          var tokenType = token.type.replace('_end', '');

          var tokensArray = tokenCollection || [ token ];
          tokenCollection = false; // reset collection
          tokensArray.links = tokens.links; // Tokens array requires a `links` property.

          var block = extend( {}, this.blockDefinition, {
            type: tokenType,
            content: this.marked.parser(tokensArray)
          });

          var additionalBlocksBeforeCurrentBlock = [];
          var additionalBlocksAfterCurrentBlock = [];

          switch (tokenType) {
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
                content: this.marked.parser(exampleTokensArray)
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

        }

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