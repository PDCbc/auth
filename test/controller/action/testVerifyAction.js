/**
 * Create by sdiemert on 15-07-25
 *
 * Unit tests for: VerifyAction.
 */

var assert               = require('assert');
var VerifyAction         = require('../../../src/controller/action/VerifyAction').VerifyAction;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var UserCookie           = require("../../../src/model/UserCookie").UserCookie;
var User                 = require("../../../src/model/User").User;
var codes                = require("../../../src/util/Codes");

describe("VerifyAction", function () {

    var cookieString = null;
    var va           = null;
    var req          = null;
    var proc         = null;
    var testFunction = null;

    beforeEach(function (done) {

        cookieString = "foo";
        proc         = {};
        req          = {
            isWellFormed: function () {
                return true;
            },
            getSourceIP : function(){
                return "foo";
            }
        };
        va           = VerifyAction(cookieString, req, proc)
        testFunction = function (x, y) {

        };

        done();

    });

    afterEach(function (done) {

        va           = null;
        proc         = null;
        req          = null;
        cookieString = null;

        done();

    });

    describe("#actionPrecondition()", function () {

        it("should throw CallbackInvalidError if the next argument is null", function (done) {

            assert.throws(function () {

                proc.actionPreCondition(null);

            }, CallbackInvalidError);

            done();

        });

        it("should throw CallbackInvalidError if the next argument is undefined", function (done) {

            assert.throws(function () {

                proc.actionPreCondition();

            }, CallbackInvalidError);

            done();

        });

        it("should throw CallbackInvalidError if the next argument is non-Function", function (done) {

            assert.throws(function () {

                proc.actionPreCondition({});

            }, CallbackInvalidError);

            done();

        });
        it("should throw CallbackInvalidError if the next argument is function with less than 2 args", function (done) {

            var cb = function (x) {

            };

            assert.throws(function () {

                proc.actionPreCondition(cb);

            }, CallbackInvalidError);

            done();

        });
        it("should throw CallbackInvalidError if the next argument is non-Function", function (done) {

            var cb = function (x, y, z) {

            };

            assert.throws(function () {

                proc.actionPreCondition(cb);

            }, CallbackInvalidError);

            done();

        });

        it("should return false if the proc.userCookie object is null", function () {

            proc.userCookie = null;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the proc.userCookie object is not set", function () {

            delete proc.userCookie;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the proc.userCookie object is non-UserCookie object", function () {

            proc.userCookie = {};
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the proc.userCookie object does not have getCookieString function", function () {

            proc.userCookie                 = new UserCookie();
            proc.userCookie.getCookieString = null;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("shoudl return false if the proc.userCookie.getCookieString() does not return a string", function () {

            proc.userCookie                 = new UserCookie();
            proc.userCookie.getCookieString = function () {
                return 5;
            };
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the req object is null", function () {

            proc.req = null;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the req object is not set", function () {

            delete proc.req;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the proc.req is a well formed objectl", function () {

            proc.req              = {};
            proc.req.isWellFormed = function () {
                return false
            };

            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return false if the upm is not set", function () {

            delete proc.upm;
            assert.equal(proc.actionPreCondition(testFunction), false);

        });

        it("should return true for satisfied preconditions", function () {

            assert.equal(proc.actionPreCondition(testFunction), true);

        });

    });

    describe("#setCookie", function () {

        it("should throw TypeError if input is null", function () {

            assert.throws(function () {
                va.setCookie(null);
            }, TypeError);

        });

        it("should throw TypeError if input is undefined", function () {

            assert.throws(function () {
                va.setCookie();
            }, TypeError);

        });

        it("should throw TypeError if the input is empty string", function () {

            assert.throws(function () {
                va.setCookie("");
            }, TypeError);

        });

        it("should throw TypeError if the input is non-string", function () {

            assert.throws(function () {
                va.setCookie("");
            }, TypeError);

        });

        it("should create a new UserCookie object with the input as cookieString", function () {

            proc.userCookie = null;
            va.setCookie("fooBar");

            assert.equal(proc.userCookie.getCookieString(), "fooBar");

        });

        it("should set the userCookie.cookieString", function () {

            va.setCookie("foobar");
            assert.equal(proc.userCookie.getCookieString(), "foobar");

        });

    });

    describe("#handleFromCookieResponse", function () {

        it("should return errors via the callback", function (done) {

            proc.callback = function (x, y) {

                assert.equal(x, 1);
                assert.equal(y, null);

                done();

            };

            proc.handleFromCookieResponse(1, "foo");

        });

        it("should return DECRYPT_COOKIE_FAILED if the result is null", function (done) {

            proc.callback = function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);
                done();

            };

            proc.handleFromCookieResponse(null, null);

        });

        it("should return DECRYPT_COOKIE_FAILED if the result is undefined", function (done) {

            proc.callback = function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);
                done();

            };

            proc.handleFromCookieResponse(null);

        });

        it("should return DECRYPT_COOKIE_FAILED if the result is not UserCookie object", function (done) {

            proc.callback = function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);
                done();

            };

            proc.handleFromCookieResponse(null, {});

        });

        it("should check source IP and return INCONSISTENT_IP if not matching", function (done) {

            var uc = new UserCookie(null, null, "foo");

            proc.req.getSourceIP = function () {
                return "bar"
            };

            proc.callback = function (x, y) {

                assert.equal(x, codes.INCONSISTENT_IP);
                assert.equal(y, null);
                done();

            };

            proc.handleFromCookieResponse(null, uc);

        });

        it("it should return DECRYPT_COOKIE_FAILED if the result is not a complete UserCookie", function (done) {

            var uc = new UserCookie(null, null, "foo");

            proc.req.getSourceIP = function () {
                return "foo"
            };

            proc.callback = function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);
                done();

            };

            proc.handleFromCookieResponse(null, uc);

        });

        it("it should return the result object if it is valid", function (done) {

            var user = new User('a', 'b', 'c', 'd', 'e');
            var uc   = new UserCookie(user, "string", "foo");

            proc.req.getSourceIP = function () {
                return "foo"
            };

            proc.callback = function (x, y) {

                assert.equal(x, null);
                assert(y instanceof UserCookie);
                done();

            };

            proc.handleFromCookieResponse(null, uc);

        });

    });

    describe("#doAction()", function () {

        it("should return ERR_FAILED_ACTION_PRECONDITION if preconditions are failed", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_ACTION_PRECONDITION);
                assert.equal(result, null);
                assert.equal(proc.callback, null);
                done();

            };

            proc.userCookie = null;
            va.doAction(cb);

        });

        it("should throw an Error if the VerifyAction is already in use", function(done){

            var cb = function(x,y){

                assert.fail();

            };

            proc.callback = "foo";
            assert.throws(function(){

                va.doAction(cb);

            }, Error);

            done();

        });

        it("should call the upm.fromCookie function", function(done){

            var fromCookie = function(x,y){

                assert(x instanceof UserCookie);
                assert(y instanceof Function);

                done();

            };

            proc.callback = null;
            proc.upm.fromCookie = fromCookie;

            va.doAction(testFunction);

        });

    });

});