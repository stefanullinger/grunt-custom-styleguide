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

  shouldCreateAStyleguideFromMultipleStylesheetsUsingMarkdownProcessor: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/styleguide_from_multiple_css_files_using_markdown_test.html');
    var expected = grunt.file.read('test/expected/styleguide_from_multiple_css_files_using_markdown_test.html');
    test.equal(actual, expected, 'should create a styleguide from multiple css files using the markdown processor.');

    test.done();
  },

  shouldBePossibleToProvideCustomProcessorWithCustomProcessFunction: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_styleguide_processor_test.html');
    var expected = grunt.file.read('test/expected/custom_styleguide_processor_test.html');
    test.equal(actual, expected, 'should be possible to provide custom processor with custom process function.');

    test.done();
  }
};
