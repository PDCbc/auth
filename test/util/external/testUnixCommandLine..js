/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: UnixCommandLine.
 */

var assert               = require('assert');
var UnixCommandLine      = require('../../../src/util/external/UnixCommandLine').UnixCommandLine;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var error = require("../../../src/util/Codes");

describe("UnixCommandLine", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#_exec", function () {

        var proc = null;
        var ucl  = null;

        var execStdin = function (cmd, stdin, next) {

            return next('execStdin', 'execStdin', 'execStdin');
        };

        var execOneLine = function (cmd, next) {

            return next('execOneLine', 'execOneLine', 'execOneLine');

        };

        beforeEach(function (done) {

            proc             = {};
            ucl              = UnixCommandLine(proc);
            proc.execStdin   = execStdin;
            proc.execOneLine = execOneLine;

            done();

        });

        afterEach(function (done) {

            proc = null;
            ucl  = null;

            done();

        });

        it("should run the execStdin if the cmd and stdin parameters are set", function (done) {

            proc._exec("foo", "bar", function (a, b, c) {

                assert.equal(a, 'execStdin');
                assert.equal(b, 'execStdin');
                assert.equal(c, 'execStdin');

                done();

            });

        });

        it("should run the execOneLine if the stdin parameters is null", function (done) {

            proc._exec("foo", null, function (a, b, c) {

                assert.equal(a, 'execOneLine');
                assert.equal(b, 'execOneLine');
                assert.equal(c, 'execOneLine');

                done();

            });

        });


        it("should run the execOneLine if the stdin parameters is empty string", function (done) {

            proc._exec("foo", '', function (a, b, c) {

                assert.equal(a, 'execOneLine');
                assert.equal(b, 'execOneLine');
                assert.equal(c, 'execOneLine');

                done();

            });

        });

    });

    describe("#exec()", function () {

        var proc = null;
        var ucl  = null;


        // a function to replace the _exec function in
        //  UnixCommandLine object. This way we don't have
        //  to rely on running the external process to test
        //  the logic within exec().
        var _exec = function (a, b, c) {

            c("test_exec", "test_exec", "test_exec");

        };

        beforeEach(function (done) {

            proc       = {};
            ucl        = UnixCommandLine(proc);
            proc._exec = _exec;

            done();

        });

        afterEach(function (done) {

            proc = null;
            ucl  = null;

            done();

        });

        it("should return with ERR_FAILED_PRECONDITION input that does not satisfy preconditions", function (done) {

            ucl.exec(null, null, function (err, sto, ste) {

                assert.equal(sto, null);
                assert.equal(ste, null);
                assert.equal(err, error.ERR_FAILED_PRECONDITION);

                done();

            });

        });

        it("should call _exec() for valid input", function (done) {

            ucl.exec("foo", null, function (err, sto, ste) {

                assert.equal(sto, "test_exec");
                assert.equal(ste, "test_exec");
                assert.equal(err, "test_exec");

                done();

            });

        });

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

        it("should return false if the sanitizeInput function is undefined", function (done) {

            delete proc.sanitizeInput;
            var r = proc.execPreconditions("foo", null, testFun);
            assert.equal(r, false);
            done();

        });

        it("should return false if the sanitizeInput function has wrong number of arguments", function (done) {

            proc.sanitizeInput = function (x, y) {
                //has to many parameters, should cause a fail.
            };
            var r              = proc.execPreconditions("foo", null, testFun);
            assert.equal(r, false);
            done();

        });


    });

});