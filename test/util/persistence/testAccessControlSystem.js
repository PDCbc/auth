/**
 * Create by sdiemert on 15-07-20
 *
 * Unit tests for: AccessControlSystem
 *
 * This is an interface definition class so all methods are abstract, and should throw errors if we try to call them.
 */

var assert              = require('assert');
var AccessControlSystem = require('../../../src/util/persistence/AccessControlSystem').AccessControlSystem;

describe("AccessControlSystem", function () {

    var acs  = null;
    var proc = null;

    beforeEach(function (done) {

        proc = {};
        acs  = AccessControlSystem(proc);

        done();

    });

    afterEach(function (done) {

        acs  = null;
        proc = null;

        done();

    });

    describe("#getUser()", function () {

        it("should throw an error", function (done) {

            assert.throws(function () {

                acs.getUser(null, null);

            });

            done();

        });

    });

    describe("#getRoles()", function () {

        it("should throw an error", function (done) {

            assert.throws(function () {

                acs.getRoles(null, null);

            });

            done();

        });

    });

    describe("#getCookie()", function () {

        it("should throw an error", function (done) {

            assert.throws(function () {

                acs.getCookie(null, null);

            });

            done();

        });

    });

    describe("#getRole()", function () {

        it("should throw an error", function (done) {

            assert.throws(function () {

                acs.getRole(null, null);

            });

            done();

        });

    });

    describe("#unbakeCookie()", function () {

        it("should throw an error", function (done) {

            assert.throws(function () {

                acs.unbakeCookie(null, null);

            });

            done();

        });

    });

});