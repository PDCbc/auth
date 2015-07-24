/**
 * Generated On: 2015-7-17
 * @class AuthenticateAction
 * @description Determines whether the indicated user (identified by a username and password) is valid.
 */

var Action                 = require('./Action').Action;
var error = require("../../util/Codes");
var User                   = require("../../model/User").User;
var UserPersistenceManager = require("../../util/persistence/UserPersistenceManager").UserPersistenceManager;
var logger                 = require('../../util/logger/Logger').Logger("AuthenticateAction");

function AuthenticateAction(user, proc) {

    proc = proc || {};

    var that = Action();

    proc.user = user;
    proc.upm  = UserPersistenceManager();

    /**
     * @description: returns true if the user object of the class is a valid user in the access control system, false otherwise.
     *
     *
     * @precondition userIsSet : the user attribute of the object contains a valid User class.
     * @precondition userPersistenceManagerExists : the object contains a reference to a UserPersistenceType
     *
     * @postcondition userIsValid : the object contains a valid User object
     *
     * @param next { Function } - called when the action is complete. Has signature next(err, result).
     *  If the authentication succeeds the err will be null and result will be the User object.
     *  If the authentication action fails the erro will be set, and result will be null.
     *  See Codes.js for descriptions of codes codes.
     *
     *  @return { null } - returns via the next parameter function.
     */
    var doAction = function (next) {

        if (!proc.actionPreCondition()) {

            logger.warn("doAction(next): " + error.ERR_FAILED_ACTION_PRECONDITION);
            return next(error.ERR_FAILED_ACTION_PRECONDITION, null);

        }

        proc.upm.populate(proc.user, function (err, result) {

            if (err) {

                logger.warn("doAction(next) : " + err);
                return next(err, null);

            } else {

                return next(null, result);

            }

        });

    };


    /**
     * Determines whether the action is set up correctly.
     *
     * @return {Boolean} - true if the preconditions are met, false otherwise.
     */
    var actionPreCondition = function () {

        if (!proc.user || !proc.upm) {

            return false;

        }

        if (!( proc.user instanceof User)) {

            return false;

        }

        return true;

    };

    that.doAction           = doAction;
    proc.actionPreCondition = actionPreCondition;

    return that;

}

module.exports = {AuthenticateAction: AuthenticateAction};