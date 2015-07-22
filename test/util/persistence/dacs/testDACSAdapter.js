/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: DACSAdapter.
 */

var assert               = require('assert');
var DACSAdapter          = require("../../../../src/util/persistence/dacs/DACSAdapter").DACSAdapter;
var User                 = require("../../../../src/model/User").User;
var CallbackInvalidError = require("../../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var Role                 = require("../../../../src/model/Role").Role;
var codes                = require("../../../../src/util/Codes");
var UserCookie           = require("../../../../src/model/UserCookie").UserCookie;


describe("DACSAdapter", function () {

    var proc = {};
    var dacs = null;


    beforeEach(function (done) {

        process.env.FEDERATION = "someFed";
        process.env.ROLEFILE   = "someRoleFile";

        proc = {};
        dacs = DACSAdapter(proc);

        done();

    });

    afterEach(function (done) {

        proc = null;
        dacs = null;

        process.env.FEDERATION = null;
        process.env.ROLEFILE   = null;

        done();

    });

    describe("#unbakeCookie()", function () {


        var user         = null;
        var userCookie   = null;
        var testFunction = null;

        beforeEach(function (done) {

            user         = new User('a', 'b', 'c');
            userCookie   = new UserCookie(user, "somecookiestring", "IP");
            testFunction = function (x, y) {
                //does nothing, but takes 2 argments.
            };

            done();

        });

        afterEach(function (done) {

            user         = null;
            userCookie   = null;
            testFunction = null;

            done();

        });

        it("should return ERR_FAILED_PRECONDITION for invalid UserCookie input", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();

            };

            dacs.unbakeCookie(null, cb);

        });

        it("should handle errors from doDacsDecryptCookie response", function (done) {

            var doDacsDecryptCookie = function (uc, callback) {
                callback(1, null); //returns an error code.
            };

            proc.doDacsDecryptCookie = doDacsDecryptCookie;

            var cb = function (err, result) {

                assert.equal(err, 1);
                assert.equal(result, null);

                done();

            };

            dacs.unbakeCookie(userCookie, cb);

        });

        it("should return DECRYPT_COOKIE_FAILED if the UserCookie result from doDacsDecryptCookie is not well formed.", function (done) {

            var doDacsDecryptCookie = function (uc, callback) {

                callback(null, new UserCookie(new User(), null, null));

            };

            proc.doDacsDecryptCookie = doDacsDecryptCookie;

            var cb = function (err, result) {

                assert.equal(err, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(result, null);

                done();

            };

            dacs.unbakeCookie(userCookie, cb);

        });

        it("should handle errors from doDacsFetchPrivateData", function (done) {

            var doDacsDecryptCookie = function (uc, callback) {

                return callback(null, userCookie);

            };

            var doDacsFetchPrivateData = function (uc, callback) {

                //callback should take an error and null.
                return callback(1, null);

            };

            proc.doDacsDecryptCookie    = doDacsDecryptCookie;
            proc.doDacsFetchPrivateData = doDacsFetchPrivateData;

            var cb = function (err, result) {

                assert.equal(err, 1);
                assert.equal(result, null);

                done();

            };

            dacs.unbakeCookie(userCookie, cb);

        });

        it("should pass valid UserCookie result forward", function (done) {

            var doDacsDecryptCookie = function (uc, callback) {

                return callback(null, userCookie);

            };

            var doDacsFetchPrivateData = function (uc, callback) {

                //callback should take an error and null.

                userCookie.getUser().setUsername('foo');
                userCookie.getUser().setPassword('bar');
                userCookie.getUser().setJurisdiction('bar');
                userCookie.getUser().setClinic('cob');
                userCookie.getUser().setClinicianId('dob');

                return callback(null, userCookie.getUser());

            };

            proc.doDacsDecryptCookie    = doDacsDecryptCookie;
            proc.doDacsFetchPrivateData = doDacsFetchPrivateData;

            var cb = function (err, result) {

                assert.equal(err, null);
                assert(result instanceof UserCookie);
                assert.equal(result.getUser().getUsername(), "foo");
                assert.equal(result.getUser().getPassword(), "bar");
                assert.equal(result.getUser().getJurisdiction(), "bar");
                assert.equal(result.getUser().getClinic(), "cob");
                assert.equal(result.getUser().getClinicianId(), "dob");

                done();

            };

            dacs.unbakeCookie(userCookie, cb);

        });

        it("should return INVALID_USER if the UserCookie.user object is not complete", function (done) {

            var doDacsDecryptCookie = function (uc, callback) {

                return callback(null, userCookie);

            };

            var doDacsFetchPrivateData = function (uc, callback) {

                //callback should take an error and null.

                return callback(null, userCookie.getUser());

            };

            proc.doDacsDecryptCookie    = doDacsDecryptCookie;
            proc.doDacsFetchPrivateData = doDacsFetchPrivateData;

            var cb = function (err, result) {

                assert.equal(err, codes.INVALID_USER);
                assert.equal(result, null);
                done();

            };

            dacs.unbakeCookie(userCookie, cb);

        });

    });

    describe("#doDacsDecryptCookie()", function () {

        var dacscookie = 'username="doctorWho"\nroles="foo,bar,baz"\njurisdiction="bin"';

        var exec = function (cmd, cookie, callback) {

            callback(null, dacscookie, "");

        };

        var userCookie = null;
        var cmd        = "dacscookie -u pdc.dev -decrypt";

        beforeEach(function (done) {

            proc.ucl.exec = exec;
            userCookie    = new UserCookie(new User(), "cookieString", "IP");

            done();

        });

        afterEach(function (done) {

            proc.ucl.exec = null;
            userCookie    = null;

            done();

        });

        it("should return error code DECRYPT_COOKIE_FAILED when the response has a non-falsey error", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(1, null, null);
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when response from dacscookie cannot be parsed", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, "cannot\nbe\nparsed\nproperly", "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when response from does not contain a username field", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'notUsername="foo"', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when response from does not contain a jurisdiction field", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'username="foo"\nnotJurisdiction="juri"', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when response from does not contain a jurisdiction field", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'username="foo"\nnotJurisdiction="juri"', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when response from does not contain a role field", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'username="foo"\njurisdiction="juri"\nNotroles="foo,bar,baz', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return error code DECRYPT_COOKIE_FAILED when roles input is an empty string", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'username="foo"\njurisdiction="juri"\nroles=""', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, codes.DECRYPT_COOKIE_FAILED);
                assert.equal(y, null);

                done();

            });

        });

        it("should return populated UserCookie object for normal input", function (done) {

            proc.ucl.exec = function (a, b, c) {
                return c(0, 'username="foo"\njurisdiction="juri"\nroles="foo,bar,baz"', "stderr");
            };

            proc.doDacsDecryptCookie(userCookie, function (x, y) {

                assert.equal(x, null);
                assert(userCookie);
                assert(y instanceof UserCookie);
                assert.equal(y.getUser().getUsername(), 'foo');
                assert.equal(y.getUser().getJurisdiction(), 'juri');
                assert.deepEqual(y.getUser().getRoles(), [new Role('foo'), new Role('bar'), new Role('baz')]);

                done();

            });

        });

    });


    describe("#parseCookieDecryptResult", function () {

        var inputString = 'username="doctorWho"\nip_address="0.0.0.0"\nroles="foo,bar,baz"';

        it("should return object with populated fields", function (done) {

            var obj = proc.parseCookieDecryptResult(inputString);

            assert.equal(typeof obj, "object");
            assert.equal(obj.username, "doctorWho");
            assert.equal(obj.ip_address, "0.0.0.0");
            assert.equal(obj.roles, "foo,bar,baz");

            done()

        });

        it("should return null if the string does not have an '='", function (done) {

            var s   = "foo\nbin\nbar";
            var obj = proc.parseCookieDecryptResult(s);
            assert.equal(obj, null);
            done();

        });

        it("should ignore empty strings", function (done) {

            var obj = proc.parseCookieDecryptResult(inputString + "\n\n");
            assert.equal(typeof obj, "object");
            assert.equal(obj.username, "doctorWho");
            assert.equal(obj.ip_address, "0.0.0.0");
            assert.equal(obj.roles, "foo,bar,baz");
            done();

        });

    });

    describe("#unbakeCookiePrecondition", function () {

        var user         = null;
        var userCookie   = null;
        var testFunction = null;

        beforeEach(function (done) {

            user         = new User('a', 'b', 'c');
            userCookie   = new UserCookie(null, "foo", "IP");
            testFunction = function (x, y) {
                //dummy callback function
            };

            done();

        });

        afterEach(function (done) {

            user         = null;
            userCookie   = null;
            testFunction = null;

            done();

        });

        it("should throw CallbackInvalidError if the next callback is null", function (done) {

            assert.throws(function () {

                proc.unbakeCookiePrecondition(userCookie, null);

            }, CallbackInvalidError);
            done();

        });

        it("should throw CallbackInvalidError if the next callback is undefined", function (done) {

            assert.throws(function () {

                proc.unbakeCookiePrecondition(userCookie);

            }, CallbackInvalidError);
            done();

        });

        it("should throw CallbackInvalidError if the next callback is not a function", function (done) {

            assert.throws(function () {

                proc.unbakeCookiePrecondition(userCookie, {});

            }, CallbackInvalidError);
            done();

        });

        it("should throw CallbackInvalidError if the next callback is a function with less than 2 args", function (done) {

            var cb = function (x) {
                //has less than 2 args.
            };

            assert.throws(function () {

                proc.unbakeCookiePrecondition(userCookie, cb);

            }, CallbackInvalidError);
            done();

        });

        it("should throw CallbackInvalidError if the next callback is a function with more than 2 args", function (done) {

            var cb = function (x, y, z) {
                //has more than 2 args.
            };

            assert.throws(function () {

                proc.unbakeCookiePrecondition(userCookie, cb);

            }, CallbackInvalidError);
            done();

        });

        it("should return false for null UserCookie parameter", function (done) {

            var r = proc.unbakeCookiePrecondition(null, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for undefinedl UserCookie parameter", function (done) {

            var r = proc.unbakeCookiePrecondition(undefined, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for non UserCookie type UserCookie parameter", function (done) {

            var r = proc.unbakeCookiePrecondition({}, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie parameter without getCookieString function", function (done) {

            userCookie.getCookieString = null;

            var r = proc.unbakeCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie parameter with getCookieString() that returns non-string", function (done) {

            userCookie.getCookieString = function () {
                return 5;
            };

            var r = proc.unbakeCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UnixCommandLine not defined.", function (done) {

            delete proc.ucl;

            var r = proc.unbakeCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for process.env.FEDERATION not set", function (done) {

            delete process.env.FEDERATION;

            var r = proc.unbakeCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return true satisfied preconditions", function (done) {

            var r = proc.unbakeCookiePrecondition(userCookie, testFunction);
            assert.equal(r, true);
            done();

        });

    });

    describe("#getCookiePrecondition()", function () {

        var user       = null;
        var userCookie = null;
        var role       = null;

        var testFunction = function (x, y) {
            //dummy callback function that takes exactly 2 args.
        };

        beforeEach(function (done) {

            user = new User('a', 'b', 'c');
            role = new Role('foo');

            user.addRole(role);

            userCookie = new UserCookie(user, null, "IP");

            done();

        });

        afterEach(function (done) {

            user       = null;
            userCookie = null;
            role       = null;

            done();

        });

        it("should return false if the method UserCookie.getIP() is not defined", function (done) {

            userCookie.getIP = undefined;

            var r = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });


        it("should return false if the member UserCookie.getIP is not a function", function (done) {

            userCookie.getIP = 5;

            var r = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the UserCookie.getIP() will return null value", function (done) {

            userCookie.ip = null;
            var r         = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the UserCookie.getIP() will non-string value", function (done) {

            userCookie.ip = 5;
            var r         = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the process.env.FEDERATION is undefined", function (done) {

            delete process.env.FEDERATION;

            var r = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the user has null roles", function (done) {

            var u   = new User('a', 'b', 'c');
            u.roles = null;
            var uc  = new UserCookie(u, null, "IP");

            var r = proc.getCookiePrecondition(uc, testFunction);

            assert.equal(r, false);

            done();

        });


        it("should throw a CallbackInvalidError if next argument is null ", function (done) {

            assert.throws(function () {

                proc.getCookiePrecondition(userCookie, null);

            }, CallbackInvalidError);

            done();

        });

        it("should throw a CallbackInvalidError if next argument is undefined", function (done) {

            assert.throws(function () {

                proc.getCookiePrecondition(userCookie);

            }, CallbackInvalidError);

            done();

        });


        it("should throw a CallbackInvalidError if next is not a function", function (done) {

            assert.throws(function () {

                proc.getCookiePrecondition(userCookie, {});

            }, CallbackInvalidError);

            done();

        });

        it("should throw a CallbackInvalidError next takes less than 2 args", function (done) {

            assert.throws(function () {

                var cb = function (x) {
                    //function that takes only 1 arg.
                };

                proc.getCookiePrecondition(userCookie, cb);

            }, CallbackInvalidError);

            done();

        });

        it("should throw a CallbackInvalidError next takes more than 2 args", function (done) {

            assert.throws(function () {

                var cb = function (x, y, z) {
                    //function that takes only 3 arg.
                };

                proc.getCookiePrecondition(userCookie, cb);

            }, CallbackInvalidError);

            done();

        });

        it("should return false if the user parameter is null", function (done) {

            var r = proc.getCookiePrecondition(null, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the user parameter is not a UserCookie type", function (done) {

            var r = proc.getCookiePrecondition({}, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false if the user parameter is not well formed", function (done) {

            var malformedUser = new User("a");

            var malformedUserCookie = new UserCookie(malformedUser, null, "IP");

            var r = proc.getCookiePrecondition(malformedUserCookie, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return true if all preconditions are satisfied", function (done) {

            var r = proc.getCookiePrecondition(userCookie, testFunction);
            assert.equal(r, true);
            done();

        });


    });

    describe("#getUser()", function () {

        it("should return ERR_FAILED_PRECONDITION if user parameter does not satisfy preconditions", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();

            };

            dacs.getUser(null, cb);

        });

        it("it should return AUTH_FAILED if the code from dacs is AUTH_FAILED", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.AUTH_FAILED);
                assert.equal(result, null);

                done();

            };

            proc.doDacsAuth = function (user, next) {

                next(codes.AUTH_FAILED, null);

            };

            dacs.getUser(new User('a', 'b', 'c'), cb);

        });

        it("should return FETCH_PRIVATE_DATA_FAILED if doDacsFetchPrivateData returns a code", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_PRIVATE_DATA_FAILED);
                assert.equal(result, null);

                done();

            };

            proc.doDacsAuth = function (user, next) {

                next(null, user);

            };

            proc.doDacsFetchPrivateData = function (user, next) {

                return next(1, null);

            };

            dacs.getUser(new User('a', 'b', 'c'), cb);

        });

        it("should return a user if doDacsFetchPrivateData is called", function (done) {

            var cb = function (err, result) {

                assert.equal(err, null);
                assert(result instanceof User);
                assert(result.isWellFormed());

                done();

            };

            proc.doDacsAuth = function (user, next) {

                return next(null, user);

            };

            proc.doDacsFetchPrivateData = function (user, next) {

                return next(null, user);

            };

            dacs.getUser(new User('a', 'b', 'c'), cb);

        });

    });

    describe("#doDacsFetchPrivateData", function () {

        it("should return valid user object if JSON is correct", function (done) {

            var obj = {"clinician": "DoctorWho", "clinic": "Tardis"};

            var exec = function (a, b, c) {
                c(null, JSON.stringify(obj), null);
            };

            var cb = function (err, result) {

                assert.equal(err, null);
                assert(result instanceof User);
                assert.equal(result.getUsername(), "a");
                assert.equal(result.getPassword(), "b");
                assert.equal(result.getJurisdiction(), "c");
                assert.equal(result.getClinicianId(), "DoctorWho");
                assert.equal(result.getIdentity(), "DoctorWho");
                assert.equal(result.getClinic(), "Tardis");

                done();

            };

            proc.ucl.exec = exec;

            proc.doDacsFetchPrivateData(new User('a', 'b', 'c'), cb);

        });

        it("should catch any exceptions and return FETCH_PRIVATE_DATA_FAILED", function (done) {

            var obj = {"clinician": "DoctorWho", "clinic": "Tardis"};

            //function that generates an error to caught.
            proc.assignPrivateData = function (a, b) {
                throw new Error();
            };

            var exec = function (a, b, c) {
                c(null, JSON.stringify(obj), null);
            };

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_PRIVATE_DATA_FAILED);
                assert.equal(result, null);

                done();

            };

            proc.ucl.exec = exec;

            proc.doDacsFetchPrivateData(new User('a', 'b', 'c'), cb);

        });

        it("should return FETCH_PRIVATE_DATA_FAILED private data is invalid structure", function (done) {


            var exec = function (a, b, c) {
                c(null, "SOME STRING THAT IS INVALID JSON", null);
            };

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_PRIVATE_DATA_FAILED);
                assert.equal(result, null);

                done();

            };

            proc.ucl.exec = exec;

            proc.doDacsFetchPrivateData(new User('a', 'b', 'c'), cb);

        });

        it("should return FETCH_PRIVATE_DATA_FAILED if the exec() return code is non-null", function (done) {

            var exec = function (a, b, c) {
                c(1, null, null);
            };

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_PRIVATE_DATA_FAILED);
                assert.equal(result, null);

                done();

            };

            proc.ucl.exec = exec;

            proc.doDacsFetchPrivateData(new User('a', 'b', 'c'), cb);

        });

        it("should call UnixCommandLine.exec()", function (done) {

            var standInFunction = function (cmd, stdin, callback) {

                assert.equal(typeof cmd, "string");
                assert.equal(stdin, null);
                assert(callback instanceof Function);
                assert.equal(callback.length, 3);

                done();

            };

            proc.ucl.exec = standInFunction;

            proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"), function (x, y) {
                //need a callback, this does nothing...
            })

        });

        it("should throw CallbackInvalidError if next is not a function", function (done) {

            assert.throws(
                function () {

                    proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"), {})

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is null", function (done) {

            assert.throws(
                function () {

                    proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"), null)

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is undefined", function (done) {

            assert.throws(
                function () {

                    proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"));

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has less than 2 parameters", function (done) {

            var cb = function (a) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has more than 2 parameters", function (done) {

            var cb = function (a, b, c) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsFetchPrivateData(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is null", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsFetchPrivateData(null, cb);

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is undefined", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsFetchPrivateData(undefined, cb);

        });


        it("should return ERR_FAILED_PRECONDITION if user parameter is not a User", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsFetchPrivateData({}, cb);

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is not well-formed", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsFetchPrivateData(new User("foo", "bin"), cb); //no jursidiction means not well-formed

        });

    });

    describe("#doDacsAuth()", function () {

        var exec = function (cmd, stdin, next) {
            next("code", "stdout", "sterr");
        };

        beforeEach(function (done) {

            proc.ucl.exec = exec;
            done();

        });

        afterEach(function (done) {

            done();

        });

        it("should call UnixCommandLine.exec() for valid input", function (done) {

            var standInFunction = function (cmd, stdin, callback) {

                assert.equal(typeof cmd, "string");
                assert.equal(stdin, null);
                assert(callback instanceof Function);
                assert.equal(callback.length, 3);

                done();

            };

            proc.ucl.exec = standInFunction;

            proc.doDacsAuth(new User("foo", "bar", "baz"), function (x, y) {
            })

        });

        it("should throw CallbackInvalidError if next is not a function", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), {})

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is null", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), null)

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is undefined", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"));

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has less than 2 parameters", function (done) {

            var cb = function (a) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has more than 2 parameters", function (done) {

            var cb = function (a, b, c) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is not a function", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), {})

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is null", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), null)

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next is undefined", function (done) {

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"));

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has less than 2 parameters", function (done) {

            var cb = function (a) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError if next callback has more than 2 parameters", function (done) {

            var cb = function (a, b, c) {
                //callback function, does nothing
            };

            assert.throws(
                function () {

                    proc.doDacsAuth(new User("foo", "bar", "baz"), cb);

                },
                CallbackInvalidError
            );

            done();

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is null", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(null, cb);

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is undefined", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(undefined, cb);

        });


        it("should return ERR_FAILED_PRECONDITION if user parameter is not a User", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth({}, cb);

        });

        it("should return ERR_FAILED_PRECONDITION if user parameter is not well-formed", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.ERR_FAILED_PRECONDITION);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(new User("foo", "bin"), cb); //no jursidiction means not well-formed

        });

        it("should return AUTH_FAILED error if code is set on response from exec", function (done) {

            var exec = function (a, b, c) {
                c(1, "foo", "bar");
            };

            proc.ucl.exec = exec;

            var cb = function (err, result) {

                assert.equal(err, codes.AUTH_FAILED);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(new User("a", "b", "c"), cb);

        });

        it("should return FETCH_ROLES_FAILED if null stdout is provided", function (done) {

            var exec = function (a, b, c) {
                c(null, "\nbl\nob\n", "bar");
            };

            proc.ucl.exec = exec;

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_ROLES_FAILED);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(new User("a", "b", "c"), cb);

        });

        it("should catch exceptions generated by helper functions and return FETCH_ROLES_FAILED", function (done) {

            var exec = function (a, b, c) {
                c(null, null, "bar");
            };

            var throwsException = function (a) {
                throw new Error();
            };

            proc.ucl.exec      = exec;
            proc.generateRoles = throwsException;
            proc.assignRoles   = throwsException;

            var cb = function (err, result) {

                assert.equal(err, codes.FETCH_ROLES_FAILED);
                assert.equal(result, null);

                done();
            };

            proc.doDacsAuth(new User("a", "b", "c"), cb);

        });

        it("should return a user with roles", function (done) {

            var exec = function (a, b, c) {
                c(null, "admin,user", "stderr");
            };

            proc.ucl.exec = exec;

            var cb = function (err, result) {

                assert.equal(err, null);
                assert(result instanceof User);
                assert.equal(result.getUsername(), "a");
                assert.equal(result.getPassword(), "b");
                assert.equal(result.getJurisdiction(), "c");
                assert(result.getRoles());
                assert.equal(result.getRoles().length, 2);
                assert.equal(result.getRoles()[0].getIdentity(), "admin");
                assert.equal(result.getRoles()[1].getIdentity(), "user");

                done();
            };

            proc.doDacsAuth(new User("a", "b", "c"), cb);

        });


    });

    describe("#assignPrivateData()", function () {

        it("should return null if the user parameter is null", function (done) {

            var result = proc.assignPrivateData(null, "foo");
            assert.equal(result, null);
            done();

        });

        it("should return null if the user parameter is undefined", function (done) {

            var result = proc.assignPrivateData(undefined, "foo");
            assert.equal(result, null);
            done();

        });

        it("should return null if the user parameter is non-User object", function (done) {

            var result = proc.assignPrivateData({}, "foo");
            assert.equal(result, null);
            done();

        });

        it("should return null if stdout parameter is null ", function (done) {

            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, null);
            assert.equal(result, null);
            done();

        });

        it("should return null if stdout parameter is undefined ", function (done) {

            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user);
            assert.equal(result, null);
            done();

        });

        it("should return null if stdout parameter is empty string", function (done) {

            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, "");
            assert.equal(result, null);
            done();

        });

        it("should return null if stdout parameter is invalid JSON", function (done) {

            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, "INVALID JSON");
            assert.equal(result, null);
            done();

        });

        it("should return null if clinician is not in private data", function (done) {

            var obj    = {clinic: "Tardis"};
            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, JSON.stringify(obj));
            assert.equal(result, null);
            done();

        });

        it("should return null if clinic is not in private data", function (done) {

            var obj    = {clinician: "DoctorWho"};
            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, JSON.stringify(obj));
            assert.equal(result, null);
            done();

        });

        it("should return null if neither clinic not clinician are in private data", function (done) {

            var obj    = {someOtherField: "someOtherData"};
            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, JSON.stringify(obj));
            assert.equal(result, null);
            done();

        });

        it("should return valid user", function (done) {

            var obj    = {clinician: "DoctorWho", clinic: "Tardis"};
            var user   = new User("foo", "bar", "baz");
            var result = proc.assignPrivateData(user, JSON.stringify(obj));

            assert(result instanceof User);
            assert.equal(result.getUsername(), "foo");
            assert.equal(result.getPassword(), "bar");
            assert.equal(result.getJurisdiction(), "baz");
            assert.equal(result.getClinicianId(), "DoctorWho");
            assert.equal(result.getClinic(), "Tardis");
            assert.equal(result.getIdentity(), "DoctorWho");
            assert.deepEqual(result.getRoles(), []); //we have not set any roles yet.

            done();

        });

    });


    describe("#assignRoles()", function () {

        it("should return null for null user", function (done) {

            var r = proc.assignRoles(null, ["foo"]);
            assert.equal(r, null);
            done();

        });

        it("should return null for undefined user", function (done) {

            var r = proc.assignRoles(undefined, ["foo"]);
            assert.equal(r, null);
            done();

        });

        it("should return null for user not a User", function (done) {

            var r = proc.assignRoles({}, ["foo"]);
            assert.equal(r, null);
            done();

        });

        it("should return null for null roles input", function (done) {

            var u = new User("foo", "bar", "baz");
            var r = proc.assignRoles(u, null);
            assert.equal(r, null);
            done();

        });

        it("should return null for undefined roles input", function (done) {

            var u = new User("foo", "bar", "baz");
            var r = proc.assignRoles(u);
            assert.equal(r, null);
            done();

        });

        it("should return augment user's roles for single role input", function (done) {

            var u     = new User("foo", "bar", "baz");
            var roles = [new Role("bin")];

            var user = proc.assignRoles(u, roles);

            assert.equal(user.getUsername(), "foo");
            assert.equal(user.getPassword(), "bar");
            assert.equal(user.getJurisdiction(), "baz");
            assert(user.getRoles());
            assert.equal(user.getRoles().length, 1);
            assert.equal(user.getRoles()[0].getIdentity(), 'bin');

            done();

        });

        it("should return augment user's roles for multi role input", function (done) {

            var u     = new User("foo", "bar", "baz");
            var roles = [new Role("bin"), new Role("fob")];

            var user = proc.assignRoles(u, roles);

            assert.equal(user.getUsername(), "foo");
            assert.equal(user.getPassword(), "bar");
            assert.equal(user.getJurisdiction(), "baz");
            assert(user.getRoles());
            assert.equal(user.getRoles().length, 2);
            assert.equal(user.getRoles()[0].getIdentity(), 'bin');
            assert.equal(user.getRoles()[1].getIdentity(), 'fob');

            done();

        });

    });

    describe("#generateRoles()", function () {

        it("should return null for null input parameter", function (done) {

            var r = proc.generateRoles(null);
            assert.equal(r, null);
            done();

        });

        it("should return null for undefined input parameter", function (done) {

            var r = proc.generateRoles();
            assert.equal(r, null);
            done();

        });

        it("should return null for non-string input parameter", function (done) {

            var r = proc.generateRoles(5);
            assert.equal(r, null);
            done();

        });

        it("should return null for string with newline", function (done) {

            var r = proc.generateRoles("foo\nbar");
            assert.equal(r, null);
            done();

        });

        it("should return empty array for empty string input", function (done) {

            var r = proc.generateRoles("");
            assert.deepEqual(r, []);
            done();

        });

        it("should return null for string with carriage return ", function (done) {

            var r = proc.generateRoles("foo\rbar");
            assert.equal(r, null);
            done();

        });

        it("should return single Role for string without comma", function (done) {

            var r1 = Role("foo");

            var r = proc.generateRoles("foo");

            assert.equal(r.length, 1);
            assert(r[0] instanceof Role);
            assert.equal(r[0].getIdentity(), "foo");

            done();

        });

        it("should return two Roles for string with single comma", function (done) {

            var r1 = Role("foo");
            var r2 = Role("bar");

            var r = proc.generateRoles("foo,bar");

            assert.equal(r.length, 2);
            assert(r[0] instanceof Role);
            assert(r[1] instanceof Role);
            assert.equal(r[0].getIdentity(), "foo");
            assert.equal(r[1].getIdentity(), "bar");

            done();

        });

    });

    describe("#getUserPrecondition()", function () {

        var testFunction = null;

        beforeEach(function (done) {

            testFunction = function (a, b) {
                //empty function.
            };

            done();

        });

        afterEach(function (done) {

            testFunction = null;

            done();

        });

        it("should return false when no user is passed", function (done) {

            var r = proc.getUserPrecondition(null, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if invalid non-User object is passed", function (done) {

            var u = {not: "a", user: "object"};

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if the User object is not well formed.", function (done) {

            var u = new User("name", "pass", null);

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return true if the user is well formed and a valid function is provided.", function (done) {

            var u = new User("name", "pass", "juri");

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, true);

            done();

        });

        it("should throw an codes if a function is not provided. ", function (done) {

            var u = new User("name", "pass", "juri");

            assert.throws(function () {
                proc.getUserPrecondition(u, null);
            }, CallbackInvalidError);

            done();

        });

        it("should throw an codes if a function with the wrong number of args is provided", function (done) {

            var u = new User("name", "pass", "juri");

            assert.throws(function () {
                proc.getUserPrecondition(u, function (a) {
                });
            }, CallbackInvalidError);

            done();

        });

        it("should throw an codes if something that is not a function is passed as next", function (done) {

            var u = new User("name", "pass", "juri");

            assert.throws(function () {
                proc.getUserPrecondition(u, {});
            }, CallbackInvalidError);

            done();

        });

        it("should return false if process.env.FEDERATION is not set", function (done) {

            delete process.env.FEDERATION;

            var u = new User("name", "pass", "juri");

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if process.env.ROLEFILE is not set", function (done) {

            delete process.env.ROLEFILE;

            var u = new User("name", "pass", "juri");

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

    });

});