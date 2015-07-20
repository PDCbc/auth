/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: DACSAdapter.
 */

var assert               = require('assert');
var DACSAdapter          = require("../../../../src/util/persistence/dacs/DACSAdapter").DACSAdapter;
var User                 = require("../../../../src/model/User").User;
var CallbackInvalidError = require("../../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var Role = require("../../../../src/model/Role").Role;


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

    describe("assignPrivateData()", function () {


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