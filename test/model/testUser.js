/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: User.
 */

var assert = require('assert');
var User   = require("../../src/model/User.js").User;
var Role   = require("../../src/model/Role.js").Role;

describe("User", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#setUsername()", function () {

        it("should set the username", function (done) {

            var user = new User();
            user.setUsername('foo');
            assert.equal(user.username, "foo");
            done();

        });

        it("should throw an error for null input parameter", function (done) {


            var user = new User();

            assert.throws(function () {
                user.setUsername(null);
            }, TypeError);

            done();

        });

        it("should throw an error for undefined input parameter", function (done) {


            var user = new User();

            assert.throws(function () {
                user.setUsername();
            }, TypeError);

            done();

        });

        it("should throw an error for non-string input parameter", function (done) {


            var user = new User();

            assert.throws(function () {
                user.setUsername(5);
            }, TypeError);

            done();

        });

    });

    describe("#getUsername()", function () {

        it("should return the username that was set", function (done) {

            var user      = new User();
            user.username = 'foo';
            assert.equal(user.getUsername(), 'foo');
            done();

        });

    });

    describe('#getClinicianId()', function () {

        it("should return the value in User.clinicianId", function (done) {
            var user         = new User();
            user.clinicianId = 'foo';
            assert.equal(user.getClinicianId(), 'foo');
            done();
        });

    });

    describe('#getClinic()', function () {

        it("should return the value in User.clinicianId", function (done) {
            var user    = new User();
            user.clinic = 'foo';
            assert.equal(user.getClinic(), 'foo');
            done();
        });

    });

    describe('#getJurisdiction()', function () {

        it("should return the value in User.clinicianId", function (done) {
            var user          = new User();
            user.jurisdiction = 'foo';
            assert.equal(user.getJurisdiction(), 'foo');
            done();
        });

    });

    describe('#getPassword()', function () {

        it("should return the value in User.clinicianId", function (done) {
            var user      = new User();
            user.password = 'foo';
            assert.equal(user.getPassword(), 'foo');
            done();
        });

    });

    describe("#setClinicianId()", function () {

        it("should set the password for a string input", function (done) {

            var user = new User();
            user.setClinicianId("foobar");
            assert.equal(user.clinicianId, "foobar");
            done();

        });

        it("should throw an error if the input parameter is null", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinicianId(null);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is undefined", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinicianId();

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is non-string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinicianId(5);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is empty string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinicianId("");

            }, TypeError);

            done();

        });


    });

    describe("#setClinic()", function () {

        it("should set the password for a string input", function (done) {

            var user = new User();
            user.setClinic("foobar");
            assert.equal(user.clinic, "foobar");
            done();

        });

        it("should throw an error if the input parameter is null", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinic(null);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is undefined", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinic();

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is non-string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinic(5);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is empty string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setClinic("");

            }, TypeError);

            done();

        });


    });

    describe("#setJurisdiction()", function () {

        it("should set the password for a string input", function (done) {

            var user = new User();
            user.setJurisdiction("foobar");
            assert.equal(user.jurisdiction, "foobar");
            done();

        });

        it("should throw an error if the input parameter is null", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setJurisdiction(null);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is undefined", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setJurisdiction();

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is non-string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setJurisdiction(5);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is empty string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setJurisdiction("");

            }, TypeError);

            done();

        });


    });

    describe("#setPassword()", function () {

        it("should set the password for a string input", function (done) {

            var user = new User();
            user.setPassword("foobar");
            assert.equal(user.password, "foobar");
            done();

        });

        it("should throw an error if the input parameter is null", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setPassword(null);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is undefined", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setPassword();

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is non-string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setPassword(5);

            }, TypeError);

            done();

        });

        it("should throw an error if the input parameter is empty string", function (done) {

            var user = new User();

            assert.throws(function () {

                user.setPassword("");

            }, TypeError);

            done();

        });


    });

    describe("#isComplete()", function () {

        it("should return false if only the username is set", function (done) {

            var u      = new User();
            u.username = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if only password is set.", function (done) {

            var u      = new User();
            u.password = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if only the jurisdiction is set", function (done) {

            var u          = new User();
            u.jurisdiction = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if only the clinicianId is set", function (done) {

            var u         = new User();
            u.clinicianId = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if only the clinic is set", function (done) {

            var u    = new User();
            u.clinic = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if only the identity is set", function (done) {

            var u      = new User();
            u.identity = "foo";
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if the roles are null", function (done) {

            var u          = new User();
            u.username     = "foo";
            u.clinic       = "foo";
            u.identity     = "foo";
            u.clinicianId  = "foo";
            u.password     = "foo";
            u.jurisdiction = "foo";
            u.roles        = null;
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return false if one of the roles is not complete", function (done) {

            var u = new User();

            u.username     = "foo";
            u.clinic       = "foo";
            u.identity     = "foo";
            u.clinicianId  = "foo";
            u.password     = "foo";
            u.jurisdiction = "foo";

            var r1 = new Role('foo');
            var r2 = new Role('bar');

            r2.name = null;

            u.roles = [r1, r2];
            assert.equal(u.isComplete(), false);
            done();

        });

        it("should return true if the user is co", function (done) {

            var u = new User();

            u.username     = "foo";
            u.clinic       = "foo";
            u.identity     = "foo";
            u.clinicianId  = "foo";
            u.password     = "foo";
            u.jurisdiction = "foo";

            var r1 = new Role('foo');
            var r2 = new Role('bar');

            u.roles = [r1, r2];
            assert.equal(u.isComplete(), true);
            done();

        });

    });


    describe("#isWellFormed()", function () {


        it("should return false for user without any fields", function (done) {

            var u = new User();

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username is provided", function (done) {

            var u = new User("username", null, null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only password is provided", function (done) {

            var u = new User(null, "password", null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only juri is provided", function (done) {

            var u = new User(null, null, "juri", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username and password are provided", function (done) {

            var u = new User("foo", "bar", null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username and jurisdiction are provided", function (done) {

            var u = new User("foo", null, "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only password and jurisdiction are provided", function (done) {

            var u = new User(null, "foo", "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return true if username, password, and jursidction are provided", function (done) {

            var u = new User("bin", "foo", "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, true);

            done();

        });

    });

    describe("#getIdentity()", function () {

        it("should have an implementation in Entity", function (done) {

            var u = new User("bin", "bar", "baz", "clinician", "clinic", []);

            var r = u.getIdentity();

            assert.equal(r, "clinician");

            done();

        });

    });

});