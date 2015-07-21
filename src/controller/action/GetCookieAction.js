/**
 * Generated On: 2015-7-17
 * @class GetCookieAction
 */

var Action                 = require('./Action').Action;
var UserCookie             = require('../../model/UserCookie').UserCookie;
var codes                  = require('../../util/Codes');
var User                   = require("../../model/User").User;
var UserPersistenceManager = require("../../util/persistence/UserPersistenceManager").UserPersistenceManager;
var CallbackInvalidError   = require("../../util/error/CallbackInvalidError").CallbackInvalidError;

/**
 * @param req {Request} The request object to use to bake the cookie.
 * @param user {User} The user object to create the cookie for, will be available in the result of doAction.
 * @param proc {Object} An object to put protected members in.
 *
 * @constructor
 *
 * @return {GetCookieAction}
 */
function GetCookieAction(user, req, proc) {

    proc = proc || {};

    var that = Action();

    proc.request = req || null;
    proc.user    = user || null;

    proc.upm = UserPersistenceManager();

    /**
     * @description Executes the action. Creates a cookie from the user and request objects that were passed in.
     *
     * @precondition userIsValid : the proc.user object is a valid and well formed user object.
     * @precondition requestIsValid : the proc.request object is a valid Request.
     * @precondition UserPersistenceManagerIsSet : the proc.upm object is set and has a asCookie() function
     *
     * @param next {Function} the function to call after the action is complete. Has signature next(err, result).
     *  If the cookie is successfully created, the err argument is null and the result will contain a UserCookie object.
     *  If the cookie could not be created, the err argument will be set and the result will be null.
     *  See Codes.js for description of error codes.
     */
    var doAction = function (next) {

        if (!proc.actionPreCondition(next)) {

            return next(codes.ERR_FAILED_ACTION_PRECONDITION, null);

        }

        proc.callback = next;  //save this for later.

        var userCookie = new UserCookie(proc.user, null, proc.request.getSourceIP());

        return proc.upm.asCookie(userCookie, proc.handleAsCookieResponse);

    };


    var handleAsCookieResponse = function (err, result) {

        //TODO: Handle any errors chekc result.

        return proc.callback(err, result);
    };

    /**
     * @description determines if the preconditions for this action are satisfied.
     *
     * @return  {Boolean} true if all preconditions are satisfied, false otherwise.
     */
    var actionPreCondition = function (next) {

        if (!next || !(next instanceof Function) || next.length !== 2) {

            throw new CallbackInvalidError("doAction(next) expects a callback function next(err, result) with 2 arguments");

        }

        if (!proc.request || !(proc.request.getSourceIP instanceof Function)) {

            return false;

        } else if (!proc.user || !(proc.user instanceof User) || !proc.user.isWellFormed()) {

            return false;

        } else if (!proc.upm || !proc.upm.asCookie || !(proc.upm.asCookie instanceof Function)) {

            return false;
        }

        return true;

    };

    proc.actionPreCondition     = actionPreCondition;
    proc.handleAsCookieResponse = handleAsCookieResponse;

    that.doAction               = doAction;

    return that;

}


module.exports = {GetCookieAction: GetCookieAction};