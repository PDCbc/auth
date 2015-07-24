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
var codes                = require("../../../src/util/Codes");

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


    describe("#doAction()", function () {

        it("should call the actionPrecondition() function", function (done) {

            proc.actionPreCondition = function (f) {

                assert(f instanceof Function);
                assert.equal(f.length, 2);
                done();

            };

            var cb = function (a, b) {
            };

            gca.doAction(cb);

        });

        it("should return ERR_FAILED_ACTION_PRECONDITION", function (done) {

            proc.actionPreCondition = function (f) {

                return false;

            };

            var cb = function (x, y) {
                assert.equal(x, codes.ERR_FAILED_ACTION_PRECONDITION);
                done();
            };

            gca.doAction(cb);
        });

        it("should call UserPersistenceManager.asCookie()", function (done) {

            proc.request = {
                getSourceIP: function () {
                }
            };
            proc.upm     = {};

            proc.upm.asCookie = function (x, y) {

                done();

            };

            var cb = function (x, y) {

            };

            gca.doAction(cb);


        });

    });

    describe("#GetCookieAction()", function(){

        it("should use default values if not provided to constructor", function(done){

            var p = {};
            var g = GetCookieAction(null, null, p);

            assert.equal(p.request, null);
            assert.equal(p.user, null);

            done();

        });

    });

    describe("#handleAsCookieResponse()", function (done) {

        it("should pass the result back and set ", function (done) {


            proc.callback = function (err, result) {

                assert.equal(proc.callback, null);
                assert.equal(err, 1);
                assert.equal(result, 2);
                done();

            };

            proc.handleAsCookieResponse(1, 2);

        });

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

            var cb = function (x) {
            };

            assert.throws(
                function () {
                    proc.actionPreCondition(cb);
                },
                CallbackInvalidError
            );

            done();

        });

        it("it should throw CallbackInvalidError if the next callback takes more than 2 args ", function (done) {

            var cb = function (x, y, z) {
            };

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