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

    process.env.FEDERATION = "someFed";
    process.env.ROLEFILE = "someRoleFile";

    beforeEach(function (done) {

        proc = {};
        dacs = DACSAdapter(proc);

        done();

    });

    afterEach(function (done) {

        proc = null;
        dacs = null;

        done();

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


    });

});