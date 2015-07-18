/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: User.
 */

var assert = require('assert');
var User   = require("../../src/model/User.js");

describe("User", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#isWellFormed()", function () {


        beforeEach(function (done) {

            done();

        });

        afterEach(function (done) {

            done();

        });

        it("should return false for user without any fields", function (done) {

            var u = new User.User();

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username is provided", function (done) {

            var u = new User.User("username", null, null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only password is provided", function (done) {

            var u = new User.User(null, "password", null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only juri is provided", function (done) {

            var u = new User.User(null, null, "juri", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username and password are provided", function (done) {

            var u = new User.User("foo", "bar", null, null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only username and jurisdiction are provided", function (done) {

            var u = new User.User("foo", null, "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return false if only password and jurisdiction are provided", function (done) {

            var u = new User.User(null, "foo", "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, false);

            done();

        });

        it("should return true if username, password, and jursidction are provided", function (done) {

            var u = new User.User("bin", "foo", "bar", null, null, null);

            var r = u.isWellFormed();

            assert.equal(r, true);

            done();

        });

    });

    describe("#getIdentity()", function () {

        it("should have an implementation in Entity", function (done) {

            var u = new User.User("bin", "bar", "baz", "clinician", "clinic", []);

            var r = u.getIdentity();

            assert.equal(r, "clinician");

            done();

        });

    });

});