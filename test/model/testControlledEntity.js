/**
 * Create by sdiemert on 15-07-23
 *
 * Unit tests for: ControlledEntity.
 */

var assert           = require('assert');
var ControlledEntity = require('../../src/model/ControlledEntity').ControlledEntity;
var Role             = require('../../src/model/Role').Role;
var User             = require('../../src/model/User').User;

describe("ControlledEntity", function () {

    describe("#getRoles()", function () {

        it("should return the object within the roles object", function (done) {

            var r  = new Role("bar");
            var ce = new ControlledEntity("foo", [r]);

            assert.deepEqual(ce.getRoles(), [r]);

            done();

        });

    });

    describe("#ControlledEntity()", function () {

        it("should set the roles and id to the values passed", function (done) {

            var r  = new Role("bar");
            var ce = new ControlledEntity("foo", [r]);
            assert.equal(ce.identity, "foo");
            assert.deepEqual(ce.getRoles(), [r]);
            done();

        });

        it("should set the roles attribute to [] if the parameter is null", function (done) {

            var r  = new Role("bar");
            var ce = new ControlledEntity("foo", null);
            assert.equal(ce.identity, "foo");
            assert.deepEqual(ce.getRoles(), []);
            done();

        });

        it("should set the roles attribute to [] if the parameter is undefined", function (done) {

            var r  = new Role("bar");
            var ce = new ControlledEntity("foo");
            assert.equal(ce.identity, "foo");
            assert.deepEqual(ce.getRoles(), []);
            done();

        });

    });

    describe("#setRoles()", function () {

        it("should throw TypeError if the input parameter is null", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.setRoles(null);
            }, TypeError);

            done();

        });

        it("should throw TypeError if the input parameter is undefined", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.setRoles();
            }, TypeError);

            done();

        });

        it("should throw TypeError if the input is an Array with null values", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.setRoles([null, null]);
            }, TypeError);

            done();

        });

        it("should throw TypeError if the input is an Array with non-Role objects", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.setRoles([{}, {}]);
            }, TypeError);

            done();

        });

        it("should remove any old roles and replace with new ones", function (done) {

            var r1 = new Role('foo');
            var r2 = new Role('bar');
            var r3 = new Role('baz');

            var ce = new ControlledEntity("foo", [r1]);

            assert.doesNotThrow(function () {
                ce.setRoles([r2, r3]);
            }, TypeError);

            assert(ce.roles instanceof Array);
            assert.equal(ce.roles.length, 2); //not three
            assert.deepEqual(ce.roles[0], r2);
            assert.deepEqual(ce.roles[1], r3);

            done();

        });

    });

    describe("#addRole()", function () {

        it("should throw a TypeError if the role is null", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.addRole(null);
            }, TypeError);

            done();

        });

        it("should throw a TypeError if the role is undefined", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.addRole(null);
            }, TypeError);

            done();

        });

        it("should throw a TypeError if the role is poorly formed", function (done) {

            var ce = new ControlledEntity(null, []);

            assert.throws(function () {
                ce.addRole(null);
            }, TypeError);

            done();

        });

        it("should throw a TypeError if the role is non-Role object", function (done) {

            var ce = new ControlledEntity("foo", []);

            assert.throws(function () {
                ce.addRole({});
            }, TypeError);

            done();

        });

        it("should create a new roles array if the array is null", function (done) {

            var ce   = new ControlledEntity("foo", null);
            var r    = new Role("r");
            ce.roles = null;
            ce.addRole(r);
            assert.deepEqual(ce.roles, [r]);
            done();

        });
    });

});