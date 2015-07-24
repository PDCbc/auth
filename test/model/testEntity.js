/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: Entity.
 */

var assert = require('assert');
var Entity = require('../../src/model/Entity').Entity;

describe("Entity", function () {

    describe("#Entity()", function () {

        it("should set the identity of the object", function (done) {

            var e = new Entity("foo");
            assert.equal(e.identity, 'foo');
            done();

        });

        it("should default the identity to null if no id argument is passed", function(done){

            var e = new Entity(null);
            assert.equal(e.identity, null);
            done();

        });

    });

    describe('#getIdentity()', function(){

        it("should return the value in the identity field", function(done){

            var e = new Entity();
            e.identity = "bar";
            assert.equal(e.getIdentity(), "bar");
            done();

        });

    });

    describe("#setIdentity()", function(){

        it("should throw TypeError if the input is null", function(done){

            var e = new Entity();
            assert.throws(function(){
                e.setIdentity(null);
            }, TypeError);
            done();

        });

        it("should throw TypeError if the input is undefined", function(done){

            var e = new Entity();
            assert.throws(function(){
                e.setIdentity();
            }, TypeError);
            done();

        });

        it("should throw TypeError if the input is non-string", function(done){

            var e = new Entity();
            assert.throws(function(){
                e.setIdentity(5);
            }, TypeError);
            done();

        });

        it("should throw TypeError if the input is empty string", function(done){

            var e = new Entity();
            assert.throws(function(){
                e.setIdentity("");
            }, TypeError);
            done();

        });

        it("should set the identity if the input is a valid non-empty string", function(done){

            var e = new Entity();
            assert.doesNotThrow(function(){

                e.setIdentity("foo");

            }, TypeError);
            assert.equal(e.identity, 'foo');
            done();

        });

    });

    describe("#isWellFormed()", function(){

        it("should throw an error to indicate it is not implemented", function(done){

            var e = new Entity();
            assert.throws(function(){

                e.isWellFormed();

            });

            done();

        });

    });


    describe("#isComplete()", function(){

        it("should return false if the identity is null", function(done){

            var e = new Entity();
            e.identity = null;
            assert.equal(e.isComplete(), false);
            done();

        });

        it("should return true if the identity is valid", function(done){

            var e = new Entity();
            e.identity = 'foo';
            assert.equal(e.isComplete(), true);
            done();

        });

    });


});