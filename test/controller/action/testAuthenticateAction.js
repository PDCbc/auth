/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: FILE TO TEST.
 */

var assert               = require('assert');
var AuthenticateAction   = require('../../../src/controller/action/AuthenticateAction').AuthenticateAction;
var User                 = require("../../../src/model/User").User;
var CallbackInvalidError = require("../../../src/util/error/CallbackInvalidError").CallbackInvalidError;
var codes                = require("../../../src/util/Codes");

describe("AuthenticateAction", function () {

    var user         = null;
    var proc         = null;
    var auth         = null;
    var testFunction = null;

    beforeEach(function (done) {

        user         = new User('foo', 'bar', 'baz')
        proc         = {};
        auth         = AuthenticateAction(user, proc);
        testFunction = function (x, y) {
        };

        done();

    });

    afterEach(function (done) {

        user         = null;
        proc         = null;
        auth         = null;
        testFunction = null;

        done();

    });

    describe("#actionPreCondition()", function () {

        it("should return false if the user is not set", function (done) {

            proc.upm  = {};
            proc.user = null;
            assert.equal(proc.actionPreCondition(testFunction), false);
            done();

        });

        it("should return false if the UserPersistenceManager is null", function (done) {

            proc.upm  = null;
            proc.user = user;
            assert.equal(proc.actionPreCondition(testFunction), false);
            done();

        });


        it("should return false if the user is not User type", function (done) {

            proc.user = {};
            proc.upm  = {};
            assert.equal(proc.actionPreCondition(testFunction), false);
            done();

        });

        it("should return true if the conditions are met", function (done) {

            assert.equal(proc.actionPreCondition(testFunction), true);
            done();

        });

        it("should throw CallbackInvalidError when callback function is null", function () {

            assert.throws(function () {

                proc.actionPreCondition(null);

            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError when callback function is undefined", function () {

            assert.throws(function () {

                proc.actionPreCondition();

            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError when callback function is non-function", function () {

            assert.throws(function () {

                proc.actionPreCondition({});

            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError when callback function has arity < 2", function () {

            var cb = function (x) {

            };

            assert.throws(function () {

                proc.actionPreCondition(cb);

            }, CallbackInvalidError);

        });

        it("should throw CallbackInvalidError when callback function has arity > 2", function () {

            var cb = function (x, y, z) {

            };

            assert.throws(function () {

                proc.actionPreCondition(cb);

            }, CallbackInvalidError);

        });

    });

    describe("#doAction()", function () {

        it("should return ERR_FAILED_ACTION_PRECONDITION if the preconditions are not met", function (done) {

            var cb = function (x, y) {
                assert.equal(x, codes.ERR_FAILED_ACTION_PRECONDITION);
                assert.equal(y, null);
                done();
            }

            proc.user = null;

            auth.doAction(cb);

        });

        it("should call populate with user object", function (done) {

            var cb = function (x, y) {};


            var populate = function(u, n){

                assert(u instanceof User);
                assert(n instanceof Function);
                done();

            };

            proc.upm = {populate : populate};

            auth.doAction(cb);

        });

        it("should handle and pass up error from populate", function(done){

            var cb = function(x,y){

                assert.equal(x, 1);
                assert.equal(y, null);

                done();

            };

            var pop = function(u, n){

                assert(u instanceof User);
                assert(n instanceof Function);
                n(1, null);

            };

            proc.upm = {populate : pop};
            auth.doAction(cb);

        });

        it("should pass success back up", function(done){

            var cb = function(x,y){

                assert.equal(x, null);
                assert.equal(y, 1);

                done();

            };

            var pop = function(u, n){

                assert(u instanceof User);
                assert(n instanceof Function);
                n(null, 1);

            };

            proc.upm = {populate : pop};
            auth.doAction(cb);

        });


    });

});