/**
 * Generated On: 2015-7-18
 * @class PersistenceManager
 * @description Interacts with persistence layer for the application. Contains mostly abstract methods.
 *  Should be sub-classed and then methods implemented. This simply defines an interface.
 */

function PersistenceManager(proc) {

    proc = proc || {};

    var that = {};

    /**
     * @param obj  {Object}
     * @param next { Function }
     */
    var populate = function (obj, next) {
        throw 'AbstractMethodNotImplementedError';

    };


    /**
     * @param obj  {Object}
     * @param next { Function }
     */
    var save = function (obj, next) {
        throw 'AbstractMethodNotImplementedError';

    };

    that.populate = populate;
    that.save     = save;

    return that;

}

module.exports = {PersistenceManager: PersistenceManager};