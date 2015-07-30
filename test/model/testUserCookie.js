/**
 * Create by sdiemert on 15-07-22
 *
 * Unit tests for: UserCookie.
 */

var assert     = require('assert');
var UserCookie = require('../../src/model/UserCookie').UserCookie;
var User       = require('../../src/model/User').User;
var Entity     = require('../../src/model/Entity').Entity;
var Role       = require("../../src/model/Role").Role;

describe("UserCookie", function () {

    beforeEach(function (done) {

        done();

    });

    afterEach(function (done) {

        done();

    });

    describe("#UserCookie()", function () {

        it("should set all values", function (done) {

            var uc = new UserCookie(new User('a'), "cookie", "ip");

            assert.equal(uc.user.username, 'a');
            assert.equal(uc.cookieString, 'cookie');
            assert.equal(uc.ip, 'ip');
            assert(uc instanceof Entity);

            done();

        });

        it("should default to null if not arguments to constructor are provided", function (done) {

            var uc = new UserCookie();

            assert.equal(uc.user, null);
            assert.equal(uc.cookieString, null);
            assert.equal(uc.ip, null);
            assert(uc instanceof Entity);

            done();

        });

    });

    describe("#getCookieString()", function () {

        it("should get the UserCookie object's cookieString attribute", function (done) {

            var uc = new UserCookie();

            uc.cookieString = "foo";

            assert.equal(uc.getCookieString(), "foo");
            assert.equal(typeof uc.getCookieString(), "string");

            done();

        });

    });

    describe("#getIP()", function () {

        it("should set the UserCookie object's ip attribute", function (done) {

            var uc = new UserCookie();

            uc.ip = "foo";

            assert.equal(uc.getIP(), "foo");
            assert.equal(typeof uc.getIP(), "string");

            done();

        });

    });

    describe("#getUser()", function () {

        it("should set the UserCookie object's user attribute", function (done) {

            var uc = new UserCookie();

            var user = new User('a', 'b', 'c');

            uc.user = user;

            assert(uc.getUser() instanceof User);
            assert.equal(uc.getUser().username, user.username);

            done();

        });

    });

    describe("#setCookieString()", function () {

        it("should set the UserCookie object's cookieString attribute", function (done) {

            var uc = new UserCookie();

            uc.setCookieString("foo");

            assert.equal(uc.getCookieString(), "foo");
            assert.equal(typeof uc.getCookieString(), "string");

            done();

        });

        it("should throw TypeError for null string input", function (done) {

            var uc = new UserCookie(null, "foo", null);

            assert.throws(function(){

                uc.setCookieString(null);

            }, TypeError);

            done();

        });

        it("should throw TypeError for undefined string input", function (done) {

            var uc = new UserCookie(null, "foo", null);

            assert.throws(function(){

                uc.setCookieString();

            }, TypeError);

            done();

        });

        it("should throw TypeError for non-string input", function (done) {

            var uc = new UserCookie(null, "foo", null);

            assert.throws(function(){

                uc.setCookieString(5);

            }, TypeError);

            done();

        });

    });

    describe("#setIP()", function () {

        it("should set the UserCookie object's ip attribute", function (done) {

            var uc = new UserCookie();

            uc.setIP("foo");

            assert.equal(uc.getIP(), "foo");
            assert.equal(typeof uc.getIP(), "string");

            done();

        });

        it("should throw TypeError if the input is null", function (done) {

            var uc = new UserCookie(null, null, "foo");

            assert.throws(function(){
                uc.setIP(null);
            }, TypeError);

            done();

        });

        it("should throw TypeError if the input is null", function (done) {

            var uc = new UserCookie(null, null, "foo");

            assert.throws(function(){
                uc.setIP();
            }, TypeError);

            done();

        });

        it("should throw TypeError if the input is non-string", function (done) {

            var uc = new UserCookie(null, null, "foo");

            assert.throws(function(){
                uc.setIP(5);
            }, TypeError);

            done();

        });

    });

    describe("#setUser()", function () {

        it("should set the UserCookie object's user attribute", function (done) {

            var uc = new UserCookie();

            var user = new User('a', 'b', 'c');

            uc.setUser(user);

            assert(uc.getUser() instanceof User);
            assert.equal(uc.getUser().username, user.username);

            done();

        });

        it("should throw a TypeError if the input is null", function(done){

            var uc = new UserCookie();

            assert.throws(function(){
                uc.setUser(null);
            }, TypeError);

            done();

        });

        it("should throw a TypeError if the input is undefined", function(done){

            var uc = new UserCookie();

            assert.throws(function(){
                uc.setUser();
            }, TypeError);

            done();

        });

        it("should throw a TypeError if the input is non User type", function(done){

            var uc = new UserCookie();

            assert.throws(function(){
                uc.setUser("notUserType");
            }, TypeError);

            done();

        });

    });

    describe("#isWellFormed()", function () {

        it("should return false for no user", function (done) {

            var uc = new UserCookie(null, "foo", "bar");
            assert.equal(uc.isWellFormed(), false);
            done();

        });

        it("should return false for non User user", function (done) {

            var uc = new UserCookie({}, "foo", "bar");
            assert.equal(uc.isWellFormed(), false);
            done();

        });

        it("should return false for non-wellformed User", function (done) {

            var uc = new UserCookie(new User('a'), "foo", "bar");
            assert.equal(uc.isWellFormed(), false);
            done();

        });

        it("should return false for normal user", function (done) {

            var uc = new UserCookie(new User('a', 'b', 'c'), "foo", "bar");
            assert.equal(uc.isWellFormed(), true);
            done();

        });

    });

    describe("#isComplete()", function () {

        it("should return false for non well formed UserCookie", function (done) {

            var uc = new UserCookie(null, 'foo', 'foo');

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false if the UserCookie.user is well-formed but not complete", function (done) {

            var user = new User('a', 'b', 'c');

            var uc = new UserCookie(user, 'foo', 'foo');

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for null ip attribute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, 'foo', null);

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for non-string ip attribute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, 'foo', 10);

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for empty string ip attribute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, 'foo', "");

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for null cookieString attibute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, null, "foo");

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for non-string cookieString attibute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, 5, "foo");

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return false for empty-string cookieString attibute", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, "", "foo");

            assert.equal(uc.isComplete(), false);

            done();

        });

        it("should return true if the UserCookie is actually complete", function (done) {

            var user = new User('a', 'b', 'c');

            user.addRole(new Role('roop'));

            user.setClinicianId("bar");
            user.setClinic("baz");

            var uc = new UserCookie(user, "bin", "foo");

            assert.equal(uc.isComplete(), true);

            done();

        });

    });

});