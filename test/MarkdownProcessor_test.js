'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var inherit = require('inherit');
var extend = require('node.extend');
var GruntCustomStyleguideProcessor = require('../units/GruntCustomStyleguideProcessor.js')(grunt);

exports.MarkdownProcessorUnitTest = {

  setUp: function(done) {
    
    this.MarkdownProcessor = require('../units/processors/markdown/markdown.js')(grunt, inherit, GruntCustomStyleguideProcessor);
    
    done();
  },

  instaceShouldHaveAMethodCalledProcess: function(test) {

    test.expect(1);

    var processor = new this.MarkdownProcessor();
    test.equal( typeof processor.process, 'function', 'An instace of MarkdownProcessor should have a method called "process".');

    test.done();

  }

};
