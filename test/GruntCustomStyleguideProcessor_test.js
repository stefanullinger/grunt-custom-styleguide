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

exports.GruntCustomStyleguideProcessorUnitTest = {

  setUp: function(done) {
    
    this.GruntCustomStyleguideProcessor = require('../units/GruntCustomStyleguideProcessor.js')(grunt);
    
    done();
  },

  instaceShouldHaveAMethodCalledProcess: function(test) {

    test.expect(1);

    var processor = new this.GruntCustomStyleguideProcessor();
    test.equal( typeof processor.process, 'function', 'An instace of GruntCustomStyleguideProcessor should have a method called "process".');

    test.done();

  }

};
