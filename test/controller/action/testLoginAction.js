/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: LoginAction.
 */

var assert      = require('assert');
var LoginAction = require('../../../src/controller/action/LoginAction').LoginAction;
var Request     = require("../../../src/controller/Request").Request;
var User        = require("../../../src/model/User").User;

describe("LoginAction", function () {

    var la      = null;
    var proc    = null;
    var user    = null;
    var req     = null;
    var testFun = null;

    beforeEach(function (done) {

        proc    = {};
        user    = new User('a', 'b', 'c');
        req     = new Request();
        la      = LoginAction(user.username, user.password, user.jurisdiction, req, proc);
        testFun = function (x, y) {

        };

        done();

    });

    afterEach(function (done) {

        proc = null;
        user = null;
        req  = null;
        la   = null;

        done();

    });

    describe("#setRequest()", function(){

        it("should throw a TypeError error if input is null", function(done){

            assert.throws(function(){

                la.setRequest(null);

            }, TypeError);

            done();

        });

        it("should throw a TypeError error if input is undefined", function(done){

            assert.throws(function(){

                la.setRequest();

            }, TypeError);

            done();

        });

        it("should set the inner req attribute if input is valid", function(done){

            assert.doesNotThrow(function(){

                la.setRequest({});

            }, TypeError);

            done();

        });

    });

    describe("#actionPreCondition()", function () {

        it("it should return false if the user is null", function (done) {

            proc.user = null;
            assert.equal(proc.actionPreCondition(testFun), false);
            done();

        });

        it("it should return false if the req object is null", function (done) {

            proc.req = null;
            assert.equal(proc.actionPreCondition(testFun), false);
            done();

        });

        it("it should return false if the user does not have have a username", function(done){

            proc.user.username = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("it should return false if the user does not have have a password", function(done){

            proc.user.password = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("it should return false if the user does not have have a jurisdiction", function(done){

            proc.user.jurisdiction = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback is not set", function(done){

            proc.callback = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback is non function", function(done){

            proc.callback = {};
            assert.equal(proc.actionPreCondition(), false);
            done();
        });

        it("should return false if the callback is undefined", function(done){

            delete proc.callback;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback has arity < 2", function(done){

            proc.callback = function(x){};
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback has arity > 2", function(done){

            proc.callback = function(x,y,z){};
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it('should return true for satisfied preconditions', function(){

            proc.callback = function(x,y){};
            assert.equal(proc.actionPreCondition(), true);

        });

    });

});