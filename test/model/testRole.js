/**
 * Create by sdiemert on 15-07-23
 *
 * Unit tests for: Role
 */

var assert = require('assert');
var Role   = require('../../src/model/Role').Role;
var User   = require('../../src/model/User').User;


describe("Role", function () {

    describe("#Role()", function () {

        it("should populate both the name and idenitity fields", function (done) {

            var r = new Role("foo");
            assert.equal(r.name, "foo");
            assert.equal(r.identity, "foo");
            done();

        });

        it("should set the name attribute to null if input parameter is undefined", function(done){

            var r = new Role();
            assert.equal(r.name, null);
            assert.equal(r.identity, null);
            done();

        });

    });

    describe("#setName()", function(done){

        it("should throw TypeError if the input parameter is null", function(done){

            var r = new Role();
            assert.throws(function(){

                r.setName(null);

            }, TypeError);
            done();
        });

        it("should throw TypeError if the input parameter is undefined", function(done){

            var r = new Role();
            assert.throws(function(){

                r.setName();

            }, TypeError);
            done();
        });

        it("should throw TypeError if the input parameter is empty string", function(done){

            var r = new Role();
            assert.throws(function(){

                r.setName("");

            }, TypeError);
            done();
        });

        it("should throw TypeError if the input parameter is non-string", function(done){

            var r = new Role();
            assert.throws(function(){

                r.setName(5);

            }, TypeError);
            done();
        });

        it("should set the name and identity if the input is a valid string type", function(done){

            var r = new Role();
            r.setName('foo');
            assert.equal(r.name, 'foo');
            assert.equal(r.identity, 'foo');
            done();

        });

    });

    describe("#getName()", function(){

        it("should return the value the name was set to", function(done){
            var r = new Role("foo");
            assert.equal(r.getName(), "foo");
            done();
        });

    });

    describe("#isWellFormed()", function(){

        it("should return false if the name is null", function(done){

            var r = new Role();
            r.name = null;
            r.identity = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is undefined", function(done){

            var r = new Role();
            delete r.name;
            r.identity = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is empty string", function(done){

            var r = new Role();
            r.name = "";
            r.identity = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is non-string", function(done){

            var r = new Role();
            r.name = 5;
            r.identity = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });

        it("should return false if the identity is null", function(done){

            var r = new Role();
            r.identity = null;
            r.name = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is undefined", function(done){

            var r = new Role();
            delete r.identity;
            r.name = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is empty string", function(done){

            var r = new Role();
            r.identity = "";
            r.name = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is non-string", function(done){

            var r = new Role();
            r.identity = 5;
            r.name = "foo";
            assert.equal(r.isWellFormed(), false);
            done();

        });

        it("should return true if the Role is actually well formed", function(done){

            var r =  new Role("foo");
            r.name = 'foo';
            r.identity = 'foo';
            assert.equal(r.isWellFormed(), true);
            done();

        });

        it("should return false if the name is null", function(done){

            var r = new Role();
            r.name = null;
            r.identity = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is undefined", function(done){

            var r = new Role();
            delete r.name;
            r.identity = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is empty string", function(done){

            var r = new Role();
            r.name = "";
            r.identity = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the name is non-string", function(done){

            var r = new Role();
            r.name = 5;
            r.identity = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });

        it("should return false if the identity is null", function(done){

            var r = new Role();
            r.identity = null;
            r.name = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is undefined", function(done){

            var r = new Role();
            delete r.identity;
            r.name = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is empty string", function(done){

            var r = new Role();
            r.identity = "";
            r.name = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });
        it("should return false if the identity is non-string", function(done){

            var r = new Role();
            r.identity = 5;
            r.name = 'foo';
            assert.equal(r.isWellFormed(), false);
            done();

        });

    });

    describe("#isComplete()", function(done){

        it("should call return true for any well formed object", function(done){

            var r = new Role("foo");
            assert.equal(r.isComplete(), true);
            done();

        });

    });

});