/**
 * Generated On: 2015-7-18
 * Class: DACSAdapter
 *
 * Description: Adapter to the DACS access control system
 */

var AccessControlSystem  = require('../AccessControlSystem').AccessControlSystem;
var CallbackInvalidError = require("../../error/CallbackInvalidError").CallbackInvalidError;
var error = require("../../error/ErrorCodes");
var User  = require("../../../model/User").User;

function DACSAdapter(proc) {

    proc = proc || {};

    var that = AccessControlSystem();

    /**
     * @documentation Authenticates the user object, and then populates it with private data from DACS.
     *
     * @precondition userIsValid : The user object that was passed in is well-formed, contains username, password, and juridiction.
     * @precondition callbackIsValid : The next callback is a function that takes 2 arguments.
     *
     * @param user  { User } - The user to get we are fetching information for.
     * @param next { Function } - The callback to send the data back in. Has signature next(err, result)
     *  If successfully fetched user information, the err argument will be null and result will contain a User object.
     *  If failure to fetch user information, the err arugment will have an error code and result will be null.
     *  See ErrorCode.js for error code definitions.
     */
    var getUser = function (user, next) {

        if (!proc.getUserPrecondition(user, next)) {
            next(error.ERR_FAILED_ACTION_PRECONDITION, null);
        }

        //if we get here we know that we have met all of the preconditions.

    };

    var getUserPrecondition = function (user, next) {

        if (!user || !(user instanceof User) || !user.isWellFormed()) {

            return false;

        }

        if (!(next instanceof Function) || !next || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.getUser(user, next) precondition failed, argument next must be a function with 2 arguments.");
        }

        return true;

    };

    /**
     * @param user { User }
     * @param next { Function }
     */
    var getRoles = function (user, next) {

        //TODO: Implement Me 

    };

    /**
     * @documentation returns a cookie based on the user and extra properties
     *
     * @param user  { User }
     * @param props  {Object}
     * @param next { Function }
     */
    var getCookie = function (user, props, next) {

        //TODO: Implement Me 

    };

    /**
     * @documentation returns the data elements that were baked into the cookie
     *
     * @param cookieString {String}
     * @param next { Function } returns the data that was baked into the cookie
     */
    var unbakeCookie = function (cookieString, next) {

        //TODO: Implement Me 

    };

    proc.getUserPrecondition = getUserPrecondition;

    that.getUser      = getUser;
    that.getRoles     = getRoles;
    that.getCookie    = getCookie;
    that.unbakeCookie = unbakeCookie;

    return that;

}

module.exports = {DACSAdapter: DACSAdapter};