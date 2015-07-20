/**
 * Create by sdiemert on 15-07-20
 *
 * Unit tests for: GetCookieAction
 */

var assert               = require('assert');
var GetCookieAction      = require('../../../src/controller/action/GetCookieAction').GetCookieAction;
var User                 = require("../../../src/model/User").User;
var Request              = require("../../../src/controller/Request").Request;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;

describe("GetCookieAction", function () {

    var proc = null;
    var gca  = null;

    var testFunction = function (x, y) {

        //dummy callback function

    };

    beforeEach(function (done) {

        proc = {};
        gca  = GetCookieAction(new User('a', 'b', 'c'), Request(), proc);

        done();

    });

    afterEach(function (done) {

        proc = null;
        gca  = null;

        done();

    });

    describe("#actionPrecondition()", function () {

        it("should return false for no request set", function (done) {

            proc.request = null;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false for non-function request.getSourceIP ", function (done) {

            proc.request.getSourceIP = "NOT A FUNCTION";

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false for null user", function (done) {

            proc.user = null;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false for undefined user", function (done) {

            delete proc.user;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if proc.user is not a User type", function (done) {

            proc.user = {};

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return true for valid user and request ", function (done) {

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, true);

            done();

        });

        it("should return false for null upm", function (done) {

            proc.upm = null;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false for undefined upm", function (done) {

            delete proc.upm;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false for undefined upm.asCookie()", function (done) {

            delete proc.upm.asCookie;

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false non-function upm.asCookie member", function (done) {

            proc.upm.asCookie = {};

            var r = proc.actionPreCondition(testFunction);

            assert.equal(r, false);

            done();

        });

        it("it should throw CallbackInvalidError if the next callback is undefined", function (done) {

            assert.throws(
                function () {
                    proc.actionPreCondition();
                },
                CallbackInvalidError
            );

            done();

        });

        it("it should throw CallbackInvalidError if the next callback is not a function", function (done) {

            var cb = {};

            assert.throws(
                function () {
                    proc.actionPreCondition(cb);
                },
                CallbackInvalidError
            );

            done();

        });

        it("it should throw CallbackInvalidError if the next callback takes less than 2 args ", function (done) {

            var cb = function(x){};

            assert.throws(
                function () {
                    proc.actionPreCondition(cb);
                },
                CallbackInvalidError
            );

            done();

        });

        it("it should throw CallbackInvalidError if the next callback takes more than 2 args ", function (done) {

            var cb = function(x,y,z){};

            assert.throws(
                function () {
                    proc.actionPreCondition(cb);
                },
                CallbackInvalidError
            );

            done();

        });

    });

});