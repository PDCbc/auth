/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: Action.
 */

var assert = require('assert');
var Action = require('../../../src/controller/action/Action').Action;

describe("Action", function () {

    var action  = null;
    var proc    = null;
    var testFun = null;

    beforeEach(function (done) {

        proc    = {};
        action  = Action(proc);
        testFun = function (x, y) {

        };

        done();

    });

    afterEach(function (done) {

        proc    = null;
        action  = null;
        testFun = null;

        done();

    });

    describe("#doAction()", function () {

        it("should throw error", function (done) {

            assert.throws(function () {

                action.doAction();

            });

            done();

        });

    });

    describe("#actionPreCondition()", function () {

        it("should throw error", function (done) {

            assert.throws(function () {

                proc.actionPreCondition();

            });

            done();

        });

    });

});