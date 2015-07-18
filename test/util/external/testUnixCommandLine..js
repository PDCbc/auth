/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: FILE TO TEST.
 */

var assert               = require('assert');
var UnixCommandLine      = require('../../../src/util/external/UnixCommandLine').UnixCommandLine;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;

describe("module_name", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#execPreconditions()", function () {

        var proc    = null;
        var ucl     = null;
        var testFun = null;

        beforeEach(function (done) {

            proc = {};
            ucl  = UnixCommandLine(proc);

            testFun = function (a, b, c) {
                //empty test callback function
                //it is important that this have three arguments.
            };

            done();

        });

        afterEach(function (done) {

            proc    = null;
            ucl     = null;
            testFun = null;

            done();

        });

        it("should return false if cmd is null", function (done) {

            var r = proc.execPreconditions(null, null, testFun);
            assert.equal(r, false);
            done();

        });

        it("should return false if cmd is non-string", function (done) {

            var r = proc.execPreconditions(5, null, testFun);
            assert.equal(r, false);
            done();

        });

        it("should return false if cmd is empty string", function (done) {

            var r = proc.execPreconditions("", null, testFun);
            assert.equal(r, false);
            done();

        });

        it("should return false if stdin is empty string", function (done) {

            var r = proc.execPreconditions("foo", "", testFun);
            assert.equal(r, false);
            done();

        });

        it("should return false if stdin is non-string", function (done) {

            var r = proc.execPreconditions("foo", 5, testFun);
            assert.equal(r, false);
            done();

        });

        it("should throw CallbackInvalidError if next is null", function (done) {

            assert.throws(function () {

                proc.execPreconditions("foo", null, null);

            }, CallbackInvalidError);

            done();

        });

        it("should throw CallbackInvalidError if next is non-function object", function (done) {

            assert.throws(function () {

                proc.execPreconditions("foo", null, {});

            }, CallbackInvalidError);

            done();

        });

        it("should throw CallbackInvalidError if next is function less than 3 args", function (done) {

            assert.throws(function () {

                proc.execPreconditions("foo", null, function (a, b) {
                });

            }, CallbackInvalidError);

            done();

        });

        it("should throw CallbackInvalidError if next is function more than 3 args", function (done) {

            assert.throws(function () {

                proc.execPreconditions("foo", null, function (a, b, c, d) {
                });

            }, CallbackInvalidError);

            done();

        });

        it("should return true for input that meets preconditions", function (done) {

            var r = proc.execPreconditions("foo", null, testFun);

            assert.equal(r, true);

            done();

        });


    });

});