/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: LoginAction.
 */

var assert      = require('assert');
var LoginAction = require('../../../src/controller/action/LoginAction').LoginAction;
var Request     = require("../../../src/controller/Request").Request;
var User        = require("../../../src/model/User").User;
var codes       = require("../../../src/util/Codes");

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

    describe("#doAction()", function () {

        it("should return ERR_FAILED_ACTION_PRECONDITION for failed preconditions", function (done) {

            var cb = function (x, y) {

                assert.equal(x, codes.ERR_FAILED_ACTION_PRECONDITION);
                assert.equal(y, null);
                done();

            };

            proc.user = null;

            la.doAction(cb);

        });

        it("should call authAction.doAction() for satisified preconditions", function (done) {

            var cb = function (c) {

                assert(c instanceof Function);
                assert.equal(c.length, 2);
                done();
            };

            var next = function(x,y){

            };

            proc.authAction = {doAction : cb};

            la.doAction(next);

        });

    });

    describe("#handleAuthActionResponse()", function () {

        it("should call the doAction of the GetCookieAction", function (done) {

            var cb = function (c) {

                assert(c instanceof Function);
                assert.equal(c.length, 2);
                done();

            };

            proc.callback     = cb;
            proc.cookieAction = {doAction: cb};

            var u          = new User();
            u.username     = 'foo';
            u.password     = 'foo';
            u.jurisdiction = 'bar';
            u.clinicianId  = 'bar';
            u.clinic       = 'bar';
            u.identity     = 'id';


            proc.handleAuthActionResponse(null, u);

        });

        it("should return the error if there was one", function (done) {

            var cb = function (err, result) {

                assert.equal(err, 'foo');
                assert.equal(result, null);
                done();

            };

            proc.callback = cb;

            proc.handleAuthActionResponse('foo', null);

        });

        it("should return INVALID_USER error if the result is not a User object", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.INVALID_USER);
                assert.equal(result, null);
                done();

            };

            proc.callback = cb;

            proc.handleAuthActionResponse(null, {});

        });

        it("should return INVALID_USER if the user is not complete", function (done) {

            var cb = function (err, result) {

                assert.equal(err, codes.INVALID_USER);
                assert.equal(result, null);
                done();

            };

            proc.callback = cb;

            proc.handleAuthActionResponse(null, new User('a'));

        });

    });

    describe("#handleCookieResponse()", function () {

        it("should call the callback", function (done) {

            var cb = function (x, y) {

                assert.equal(x, 'foo');
                assert.equal(y, 'bar');
                done();
            };

            proc.callback = cb;

            proc.handleCookieResponse('foo', 'bar');

        });

    });

    describe('#getUser()', function () {

        it("should return the user attribute", function () {

            var u = la.getUser();
            assert.equal(u.getUsername(), 'a');
            assert.equal(u.getPassword(), 'b');
            assert.equal(u.getJurisdiction(), 'c');

        });

    });

    describe('#getRequest()', function () {

        it("should return the user attribute", function () {

            proc.req = {bar: "bar"};
            var u    = la.getRequest();
            assert.equal(u.bar, 'bar');

        });

    });

    describe("#setUser()", function () {

        it("should throw TypeError if input is null", function () {

            assert.throws(function () {

                la.setUser(null);

            }, TypeError);

        });

        it("should throw TypeError if input is undefined", function () {

            assert.throws(function () {

                la.setUser();

            }, TypeError);

        });

        it("should throw a TypeError if input is non user object", function () {

            assert.throws(function () {

                la.setUser({});

            }, TypeError);

        });

        it("should set the user attribute if a valid user is provided", function () {


            assert.doesNotThrow(function () {

                la.setUser(new User('foo', 'bar', 'bin'));

            }, TypeError);

        });

    });

    describe("#setRequest()", function () {

        it("should throw a TypeError error if input is null", function (done) {

            assert.throws(function () {

                la.setRequest(null);

            }, TypeError);

            done();

        });

        it("should throw a TypeError error if input is undefined", function (done) {

            assert.throws(function () {

                la.setRequest();

            }, TypeError);

            done();

        });

        it("should set the inner req attribute if input is valid", function (done) {

            assert.doesNotThrow(function () {

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

        it("it should return false if the user does not have have a username", function (done) {

            proc.user.username = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("it should return false if the user does not have have a password", function (done) {

            proc.user.password = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("it should return false if the user does not have have a jurisdiction", function (done) {

            proc.user.jurisdiction = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback is not set", function (done) {

            proc.callback = null;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback is non function", function (done) {

            proc.callback = {};
            assert.equal(proc.actionPreCondition(), false);
            done();
        });

        it("should return false if the callback is undefined", function (done) {

            delete proc.callback;
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback has arity < 2", function (done) {

            proc.callback = function (x) {
            };
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it("should return false if the callback has arity > 2", function (done) {

            proc.callback = function (x, y, z) {
            };
            assert.equal(proc.actionPreCondition(), false);
            done();

        });

        it('should return true for satisfied preconditions', function () {

            proc.callback = function (x, y) {
            };
            assert.equal(proc.actionPreCondition(), true);

        });

    });

});