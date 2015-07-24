/**
 * Create by sdiemert on 15-07-24
 *
 * Unit tests for: FILE TO TEST.
 */

var assert             = require('assert');
var PersistenceManager = require('../../../src/util/persistence/PersistenceManager').PersistenceManager;

describe("PersistenceManager", function () {

    var proc = null;
    var pm   = null;

    beforeEach(function (done) {

        proc = {};
        pm   = PersistenceManager(proc);

        done();

    });

    afterEach(function (done) {

        proc = null;
        pm   = null;

        done();

    });

    describe("#populate()", function () {

        it("should throw an error", function (done) {

            assert.throws(function(){

                pm.populate();

            });

            done();

        });

    });

    describe("#save()", function () {

        it("should throw an error", function (done) {

            assert.throws(function(){

                pm.populate();

            });

            done();

        });

    });

});