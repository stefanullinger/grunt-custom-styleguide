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

exports.GruntStyleGuideUnitTest = {

  setUp: function(done) {
    
    this.GruntCustomStyleguide = require('../units/GruntCustomStyleguide.js')(grunt);
    
    done();
  },

  instaceShouldHaveAMemberCalledProcessors: function(test) {

    test.expect(1);

    var styleguide = new this.GruntCustomStyleguide();
    test.notStrictEqual( typeof styleguide.processors !== 'undefined', 'An instace of GruntCustomStyleguide should have a member named "processors".');

    test.done();

  },

  instaceMemberProcessorsShouldBeAnObject: function(test) {

    test.expect(1);

    var styleguide = new this.GruntCustomStyleguide();
    test.strictEqual( Object.prototype.toString.call( styleguide.processors ), '[object Object]', 'Instace member "processors" should be an object.');

    test.done();

  },

  registeringAProcessorShouldAddTheProvidedKeyValuePairToTheProcessorsObject: function(test) {

    test.expect(1);

    var styleguide = new this.GruntCustomStyleguide();

    var processorName = 'myProcessor';
    var processor = { process: function() {} };

    styleguide.registerProcessor( processorName, processor );
    test.strictEqual( styleguide.processors[processorName], processor, 'Registering a processor should add the provided key-value pair to the "processors" object.');

    test.done();

  },

  _getStylesheetContentShouldReturnTheInputWhenProvidedAStringThatIsNotAFile: function(test) {

    test.expect(1);

    var styleguide = new this.GruntCustomStyleguide();
    var input = '.12345abc';
    var stylesheetContent = styleguide._getStylesheetContent( input );
    test.strictEqual( stylesheetContent, input, '_getStylesheetContent should return the input when provided a string that is not a file.');

    test.done();

  },

  parseStylesheetShouldReturnAnArray: function(test) {

    test.expect(1);

    var styleguide = new this.GruntCustomStyleguide();
    var input = '/* My Comment */\n.body { background-color: "#FFF"; }';
    var stylesheetRules = styleguide.parseStylesheet( input );

    test.strictEqual( Object.prototype.toString.call( stylesheetRules ), '[object Array]', 'parseStylesheet should return an array.');

    test.done();

  }

};
