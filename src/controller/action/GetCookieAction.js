/**
 * Generated On: 2015-7-17
 * Class: GetCookieAction
 */

var Action     = require('./Action').Action;
var UserCookie = require('../../model/UserCookie').UserCookie;
var codes      = require('../../util/Codes');
var User       = require("../../model/User").User;

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

    /**
     * @documentation Executes the action. Creates a cookie from the user and request objects that were passed in.
     *
     * @precondition userIsValid : the proc.user object is a valid and well formed user object.
     * @precondition request : the proc.request object is a valid Request.
     *
     * @param next {Function} the function to call after the action is complete. Has signature next(err, result).
     *  If the cookie is successfully created, the err argument is null and the result will contain a UserCookie object.
     *  If the cookie could not be created, the err argument will be set and the result will be null.
     *  See Codes.js for description of error codes.
     */
    var doAction = function (next) {

        if (!proc.actionPreCondition()) {

            return next(codes.ERR_FAILED_PRECONDITION, null);

        }

        var userCookie = new UserCookie(proc.user, null, proc.request.getSourceIP());

        return next(null, userCookie);

    };

    /**
     * @documentation determines if the preconditions for this action are satisfied.
     *
     * @return  {Boolean} true if all preconditions are satisfied, false otherwise.
     */
    var actionPreCondition = function () {

        if (!proc.request || !(proc.request.getSourceIP instanceof Function)) {

            return false;

        } else if (!proc.user || !(proc.user instanceof User) || !proc.user.isWellFormed()) {

            return false;

        }

        return true;

    };

    that.doAction           = doAction;
    proc.actionPreCondition = actionPreCondition;

    return that;

}


module.exports = {GetCookieAction: GetCookieAction};