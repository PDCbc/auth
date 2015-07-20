/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: DACSAdapter.
 */

var assert               = require('assert');
var DACSAdapter          = require("../../../../src/util/persistence/dacs/DACSAdapter").DACSAdapter;
var User                 = require("../../../../src/model/User").User;
var CallbackInvalidError = require("../../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var Role  = require("../../../../src/model/Role").Role;
var codes = require("../../../../src/util/Codes");


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

    describe("#doDacsFetchPrivateData", function () {

        //it()

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
                c(null, null, "bar");
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