/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: ExternalProgram.
 */

var assert          = require('assert');
var ExternalProgram = require('../../../src/util/external/ExternalProgram').ExternalProgram;

describe("ExternalProgram", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#sanitizeInput()", function () {


        var proc = {};
        var ep   = null;

        beforeEach(function (done) {

            proc = {};
            ep   = ExternalProgram(proc);

            done();
        });

        afterEach(function (done) {

            proc = null;
            ep   = null;

            done();

        });

        it("should throw an error for no input string", function (done) {

            assert.throws(function () {
                    proc.sanitizeInput(null);
                }
                , Error
            );

            done();

        });

        it("should not effect a string without special characters", function (done) {

            var s = proc.sanitizeInput("foo");

            assert.equal(s, "foo");

            done();

        });

        it("should remove semi-colons", function (done) {

            var s = proc.sanitizeInput("foo;");

            assert.equal(s, "foo");

            done();

        });

        it("should remove semi-colon in middle of text", function (done) {

            var s = proc.sanitizeInput("fo;o");

            assert.equal(s, "foo");

            done();

        });

        it("should escape quotes", function (done) {

            var s = proc.sanitizeInput("'foo");

            assert.equal(s, "\'foo");

            done();

        });

    });

});