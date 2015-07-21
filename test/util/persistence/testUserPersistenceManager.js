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

describe("module_name", function () {

    var upm        = null;
    var proc       = null;
    var userCookie = null;



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

    describe("#asCookiePrecondition()", function () {

        var testFunction = function(x,y){
            //dummy callback function that has 2 args, required for testing this function.
        };

        it("should throw CallbackInvalidError for undefined callback", function (done) {

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for null callback", function(done){

             assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, null);
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for non-function callback input", function(done){

            assert.throws(
                function () {
                    proc.asCookiePrecondition(userCookie, {});
                },
                CallbackInvalidError
            );

            done();

        });

        it("should throw CallbackInvalidError for callback function with less than 2 args", function(done){

            var cb = function(x){
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

        it("should throw CallbackInvalidError for callback function with more than 2 args", function(done){

            var cb = function(x,y,z){
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

        it("should return false for null userCookie", function(done){

            var r = proc.asCookiePrecondition(null, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for undefined userCookie", function(done){

            var r = proc.asCookiePrecondition(undefined, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for userCookie that is not UserCookie type", function(done){

            var r = proc.asCookiePrecondition({}, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that is not well-formed", function(done){

            var uc = new UserCookie(new User('a', 'b'), null, "IP");

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that has null user", function(done){

            var uc = new UserCookie(null, null, "IP");

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for UserCookie that null IP", function(done){

            var uc = new UserCookie(new User('a', 'b'), null, null);

            var r = proc.asCookiePrecondition(uc, testFunction);
            assert.equal(r, false);
            done();

        });

        it("should return false for undefined proc.acs member", function(done){

            delete proc.acs;
            var r = proc.asCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done()

        });


        it("should return false for undefined proc.acs.getCookie function", function(done){

            delete proc.acs.getCookie;
            var r = proc.asCookiePrecondition(userCookie, testFunction);
            assert.equal(r, false);
            done()

        });

        it("should return true for inputs that meet preconditions", function(done){

            var r = proc.asCookiePrecondition(new UserCookie(new User('a','b','c'), null, "IP"), testFunction);
            assert.equal(r, false);
            done()

        });

    });

});