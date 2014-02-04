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

exports.custom_styleguide = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  basic_process_test: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/basic_process_test.json');
    var expected = grunt.file.read('test/expected/basic_process_test.json');
    test.equal(actual, expected, 'should run the process function for specified files when defined');

    test.done();
  }
};
