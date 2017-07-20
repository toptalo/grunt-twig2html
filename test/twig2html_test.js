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

exports.twig2html = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    target: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/index.html');
        var expected = grunt.file.read('test/expected/index.html');
        test.equal(actual, expected, 'Global result should match');

        test.done();
    },
    functions: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/tel.html');
        var expected = grunt.file.read('test/expected/tel.html');
        test.equal(actual, expected, 'Functions result should match');

        test.done();
    },
    filters: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/greeting.html');
        var expected = grunt.file.read('test/expected/greeting.html');
        test.equal(actual, expected, 'Filters result should match');

        test.done();
    },
    allTogether: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/concat.html');
        var expected = grunt.file.read('test/expected/concat.html');
        test.equal(actual, expected, 'Concat result should match');

        test.done();
    }
};
