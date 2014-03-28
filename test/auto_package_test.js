'use strict';

var grunt = require('grunt');
var path = require('path');
var cwd = process.cwd();


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