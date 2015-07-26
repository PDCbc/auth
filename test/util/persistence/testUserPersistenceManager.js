/**
 * Create by sdiemert on 15-07-20
 *
 * Unit tests for: UserPersistenceManager
 */

var assert               = require('assert');
var UPM                  = require('../../../src/util/persistence/UserPersistenceManager').UserPersistenceManager;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var User                 = require("../../../src/model/User").User;
var UserCookie           = require("../../../src/model/UserCookie").UserCookie;
var codes                = require("../../../src/util/Codes");

describe("UserPersistenceManager", function () {

    var upm          = null;
    var proc         = null;
    var userCookie   = null;
    var testFunction = function (x, y) {
        //dummy callback function that has 2 args, required for testing this function.
    };


    beforeEach(function (done) {

        proc       = {};
        upm        = UPM(proc);
        userCookie = new UserCookie(new User('a', 'b', 'c'), null, "127.0.0.1");

        done();

    });

    afterEach(function (done) {

        proc       = null;
        upm        = null;
        userCookie = null;

        done();

    });

    describe("#asCookie()", function () {

        it("should return ERR_FAILED_PRECONDITION if the preconditions are not met", function (done) {

            var cb = function (x, y) {

                assert.equal(x, codes.ERR_FAILED_PRECONDITION);
                assert.equal(y, null);
                done();

            };

            upm.asCookie(null, cb);

        });

        it("should call and handle an error from getCookie", function (done) {

            var cb = function (x, y) {

                assert.equal(x, 1);
                assert.equal(y, null);
                done();

            };

            proc.acs = {
                getCookie: function (uc, next) {

                    next(1, null);
                }
            };

            upm.asCookie(userCookie, cb);

        });

        it("should return GET_COOKIE_FAILED if the result is not complete", function (done) {

            var cb = function (x, y) {

                assert.equal(x, codes.GET_COOKIE_FAILED);
                assert.equal(y, null);
                done();

            };

            proc.acs = {
                getCookie: function (uc, next) {

                    next(null, new UserCookie());

                }
            };

            upm.asCookie(userCookie, cb);

        });

        it("should return a UserCookie object if the result was valid", function (done) {

            var cb = function (x, y) {

                assert.equal(x, null);
                assert(y instanceof UserCookie);
                assert.equal(y.ip, "127.0.0.1");
                done();

            };

            proc.acs = {
                getCookie: function (uc, next) {

                    userCookie.cookieString     = "foo";
                    userCookie.user.clinicianId = 'id';
                    userCookie.user.clinic      = 'clinic';
                    userCookie.user.identity    = 'id';
                    next(null, userCookie);

                }
            };

            upm.asCookie(userCookie, cb);

        });


    });

    describe("#asCookiePrecondition()", function () {


        it("should throw CallbackInvalidError for undefined callback", function (done) {

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for null callback", function (done) {

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, null);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for non-function callback input", function (done) {

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, {});
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for callback function with less than 2 args", function (done) {

            var cb = function (x) {
                //dummy callback
            };

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, cb);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for callback function with more than 2 args", function (done) {

            var cb = function (x, y, z) {
                //dummy callback
            };

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, cb);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should return false for null userCookie", function (done) {

            var r = proc.asCookiePrecondition(null, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for undefined userCookie", function (done) {

            var r = proc.asCookiePrecondition(undefined, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for userCookie that is not UserCookie type", function (done) {

            var r = proc.asCookiePrecondition({}, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that is not well-formed", function (done) {

            var uc = new UserCookie(new User('a', 'b'), null, "IP");

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that has null user", function (done) {

            var uc = new UserCookie(null, null, "IP");

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that null IP", function (done) {

            var uc = new UserCookie(new User('a', 'b'), null, null);

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for undefined proc.acs member", function (done) {

            delete proc.acs;
            var r = proc.asCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done()

        });


        it("should return false for undefined proc.acs.getCookie function", function (done) {

            delete proc.acs.getCookie;
            var r = proc.asCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done()

        });

        it("should return true for inputs that meet preconditions", function (done) {

            var r = proc.asCookiePrecondition(userCookie, testFunction);
            assert.equal(r, true);
            done()

        });

    });

    describe("#populatePrecondition()", function () {

        it("should return false if the user argument is null", function () {

            assert.equal(proc.populatePrecondition(null, testFunction), false);

        });

        it("should return false if the user argument is undefined", function () {

            assert.equal(proc.populatePrecondition(undefined, testFunction), false);

        });

        it("should return false if the user is non-User object", function () {

            assert.equal(proc.populatePrecondition({}, testFunction), false);

        });

        it("should return false if the user is not well-formed", function () {

            var u = new User();
            assert.equal(proc.populatePrecondition(u, testFunction), false);

        });

        it("should return false if the proc.acs field is not set", function () {

            delete proc.acs;
            assert.equal(proc.populatePrecondition(new User('a', 'b', 'c'), testFunction), false);

        });

        it("should throw a CallbackInvalidError if the next argument is null", function () {

            assert.throws(function () {

                proc.populatePrecondition(new User('a', 'b', 'c'), null);

            }, CallbackInvalidError);

        });

        it("should throw a CallbackInvalidError if the next argument is undefined", function () {

            assert.throws(function () {

                proc.populatePrecondition(new User('a', 'b', 'c'));

            }, CallbackInvalidError);

        });

        it("should throw a CallbackInvalidError if the next argument is non-Function object", function () {

            assert.throws(function () {

                proc.populatePrecondition(new User('a', 'b', 'c'), {});

            }, CallbackInvalidError);

        });

        it("should throw a CallbackInvalidError if the next argument is function with less than 2 args", function () {

            var cb = function (x) {
            };


            assert.throws(function () {

                proc.populatePrecondition(new User('a', 'b', 'c'), cb);

            }, CallbackInvalidError);

        });

        it("should throw a CallbackInvalidError if the next argument is function with more than 2 args", function () {

            var cb = function (x, y, z) {
            };


            assert.throws(function () {

                proc.populatePrecondition(new User('a', 'b', 'c'), cb);

            }, CallbackInvalidError);

        });

        it("should return true for inputs that satisfy preconditions", function () {

            var r = null;
            assert.doesNotThrow(function () {

                r = proc.populatePrecondition(new User('a', 'b', 'c'), testFunction);

            }, CallbackInvalidError);

            assert.equal(r, true);

        });

    });

    describe("#fromCookiePrecondition()", function () {

        it("should throw CallbackInvalidError if the next argument is null", function () {

            assert.throws(function () {
                proc.fromCookiePrecondition(userCookie, null);
            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError if the next argument is undefined", function () {

            assert.throws(function () {
                proc.fromCookiePrecondition(userCookie);
            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError if the next argument is non-Function", function () {

            assert.throws(function () {
                proc.fromCookiePrecondition(userCookie, {});
            }, CallbackInvalidError);

        });
        it("should throw CallbackInvalidError if the next argument function with less than 2 args", function () {

            var c = function (x) {

            };

            assert.throws(function () {
                proc.fromCookiePrecondition(userCookie, c);
            }, CallbackInvalidError);

        });
        it("should throw CallbackInvalidError if the next argument function with more than 2 args", function () {

            var c = function (x, y, z) {

            };

            assert.throws(function () {
                proc.fromCookiePrecondition(userCookie, c);
            }, CallbackInvalidError);

        });

        it("should return false if the uc argument is null", function () {

            assert.equal(proc.fromCookiePrecondition(null, testFunction), false);

        });

        it("should return false if the uc argument is undefined", function () {

            assert.equal(proc.fromCookiePrecondition(undefined, testFunction), false);

        });

        it("should return false if the uc argument is non-UserCookie object", function () {

            assert.equal(proc.fromCookiePrecondition({}, testFunction), false);

        });

        it("should return false if the uc argument does not contain a getCookieString function", function () {

            assert.equal(proc.fromCookiePrecondition({notGetCookieString: {}}, testFunction), false);

        });

        it("should return false if the uc argument is UserCookie object, but getCookieString returns non-string", function () {

            var x = new UserCookie();

            x.getCookieString = function () {
                return 5;
            };

            assert.equal(proc.fromCookiePrecondition(x, testFunction), false);

        });

        it("should return false if proc.acs is not set", function () {

            delete proc.acs;
            userCookie.setCookieString("foobar");
            assert.equal(proc.fromCookiePrecondition(userCookie, testFunction), false);

        });

        it("should return true if preconditions pass", function () {

            userCookie.setCookieString("foobar");
            assert.equal(proc.fromCookiePrecondition(userCookie, testFunction), true);

        });

    });

    describe("#fromCookie", function () {

        it("should return ERR_FAILED_PRECONDITION if preconditions are not met", function (done) {

            var cb = function (x, y) {

                assert.equal(x, codes.ERR_FAILED_PRECONDITION);
                assert.equal(y, null);
                done();
            };

            upm.fromCookie(null, cb);

        });

        it("should call acs.unbakeCookie and forward an response via the next callback function", function (done) {

            proc.acs.unbakeCookie = function (x, y) {

                assert(x instanceof UserCookie);
                assert(y instanceof Function);
                assert.equal(y.length, 2);

                y(1, 2);

            };

            var cb = function (x, y) {

                assert.equal(x, 1);
                assert.equal(y, 2);
                done();

            };

            userCookie.setCookieString("foo");
            upm.fromCookie(userCookie, cb);

        });

    });

    describe("#populate()", function () {

        it("should return ERR_FAILED_PRECONDITION if a precondition is not met", function (done) {

            var cb = function (x, y) {

                assert.equal(x, codes.ERR_FAILED_PRECONDITION);
                assert.equal(y, null);
                done();

            };

            upm.populate(null, cb);

        });

        it("should call proc.acs.getUser and handle an error", function (done) {

            proc.acs.getUser = function (user, next) {

                assert(user instanceof User);
                assert(next instanceof Function);

                next(1, null);

            };

            var cb = function (x, y) {

                assert.equal(x, 1);
                assert.equal(y, null);
                done();

            };

            upm.populate(new User('a','b','c'), cb);

        });

        it("should call proc.acs.getUser and pass result", function (done) {

            proc.acs.getUser = function (user, next) {

                assert(user instanceof User);
                assert(next instanceof Function);

                next(null, 1);

            };

            var cb = function (x, y) {

                assert.equal(x, null);
                assert.equal(y, 1);
                done();

            };

            upm.populate(new User('a','b','c'), cb);

        });

    });


});