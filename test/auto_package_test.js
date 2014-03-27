'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs-extra');
var cwd = process.cwd();

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

exports.auto_package = {
  setUp: function(done) {
    done();
  },
  tearDown: function (done){
    done();
  },
  auto_package_simple: function ( test ) {
    test.expect(1);

    var expected = grunt.file.read(path.join(cwd, 'test', 'expected', '_ajax', 'file.js'));
    var actual = grunt.file.read(path.join(cwd, 'test', '_packages', '_ajax', '__build.js'));

    test.equal(actual, expected);

    test.done();
  },
  auto_package_index_order_1: function ( test ) {
    test.expect(1);

    var expected = grunt.file.read(path.join(cwd, 'test', 'expected', '_event', 'file.js'));
    var actual = grunt.file.read(path.join(cwd, 'test', '_packages', '_event', '__build.js'));

    test.equal(actual, expected);

    test.done();
  },
  auto_package_index_order_2: function ( test ) {
    test.expect(1);

    var expected = grunt.file.read(path.join(cwd, 'test', 'expected', '_event_reverse', 'file.js'));
    var actual = grunt.file.read(path.join(cwd, 'test', '_packages', '_event_reverse', '__build.js'));

    test.equal(actual, expected);

    test.done();
  }
};