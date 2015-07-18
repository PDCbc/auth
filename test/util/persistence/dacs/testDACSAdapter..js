/**
 * Create by sdiemert on 15-07-18
 *
 * Unit tests for: FILE TO TEST.
 */

var assert      = require('assert');
var DACSAdapter = require("../../../../src/util/persistence/dacs/DACSAdapter").DACSAdapter;
var User        = require("../../../../src/model/User").User;


describe("DACSAdapter", function () {

    var proc = {};
    var dacs = null;

    beforeEach(function (done) {

        dacs = DACSAdapter(proc);

        done();

    });

    afterEach(function (done) {

        proc = {};
        dacs = null;

        done();

    });

    describe("#getUserPrecondition()", function () {

        var testFunction = null;

        beforeEach(function (done) {

            testFunction = function (a, b) {
                //empty function.
            };

            done();

        });

        afterEach(function (done) {

            testFunction = null;

            done();

        });

        it("should return false when no user is passed", function (done) {

            var r = proc.getUserPrecondition(null, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if invalid non-User object is passed", function (done) {

            var u = {not: "a", user: "object"};

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return false if the User object is not well formed.", function (done) {

            var u = new User("name", "pass", null);

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, false);

            done();

        });

        it("should return true if the user is well formed and a valid function is provided.", function (done) {

            var u = new User("name", "pass", "juri");

            var r = proc.getUserPrecondition(u, testFunction);

            assert.equal(r, true);

            done();

        });

        it("should throw an error if a function is not provided. ", function (done) {

            var u = User("name", "pass", "juri");

            assert.throws(proc.getUserPrecondition(u, null));

            done();

        });

        it("should throw an error if a function with the wrong number of args is provided", function (done) {

            var u = User("name", "pass", "juri");

            assert.throws(proc.getUserPrecondition(u, function (a) {
            }));

            done();

        });

        it("should throw an error if something that is not a function is passed as next", function (done) {

            var u = User("name", "pass", "juri");

            assert.throws(proc.getUserPrecondition(u, {}));

            done();

        });


    });

});