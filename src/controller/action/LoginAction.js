/**
 * Generated On: 2015-7-17
 * Class: LoginAction
 *
 * Description: An action for logging a user into the system. Obtains a cookie that represents the user.
 */

var logger             = require("../../util/logger/Logger").Logger("LoginAction");
var error = require("../../util/Codes");
var Action             = require('./Action').Action;
var User               = require("../../model/User").User;
var AuthenticateAction = require("./AuthenticateAction").AuthenticateAction;
var util  = require('util');
var codes = require("../../util/Codes.js");

/**
 * @constructor
 * @param username {String} - The usename of the user to attempt to login.
 * @param password {String} - Password associated with the username.
 * @param juri {String} - Jurisdiction identifier to log the user into.
 * @param req {Request} - HTTP request object, required to generate a cookie.
 * @param proc {Object} - Protected variables in here.
 * @returns { LoginAction }
 */
function LoginAction(username, password, juri, req, proc) {

    proc = proc || {};

    var that = Action();

    proc.req        = req;
    proc.user       = new User(username, password, juri);
    proc.authAction = null;
    proc.callback   = null; //to be called when the doAction() is finished.

    /**
     * @param next {Function} - to call when the action is complete. Has signature: next(err, result).
     *  If the authentication action was successful, the err will be null and result will contain a UserCookie object.
     *  If the authentication action failed the result will be null and the err will be set.
     *  See Codes.js for codes definitions.
     */
    var doAction = function (next) {

        proc.callback = next;

        if (proc.actionPreCondition()) {

            proc.authAction = AuthenticateAction(proc.user);

            //authenticate the user.
            return proc.authAction.doAction(proc.handleAuthActionResponse);

        } else {

            return next(error.ERR_FAILED_ACTION_PRECONDITION, null);

        }

    };

    /**
     * The callback to handle the response from the AuthenicateAction.doAction call.
     *
     * @param err {String} - An codes code, null if the auth action succeeds.
     * @param result {User} - The user object that was authenticated, null if auth action fails.
     */
    var handleAuthActionResponse = function (err, result) {


        if (err && !result) {

            //Authentication failed. Pass back to the parent.

            logger.warn("handleAuthActionResponse(err, result) got an error, returning: " + err);

            return proc.callback(err, null);

        } else {

            //successful auth, result contains a fully populated user object.

            //check that we recieved a valid object back.
            if (result instanceof User && result.isComplete()) {

                //TODO: create GetCookieAction and call its doAction() method

                logger.success(util.inspect(result));

                //change me later.
                return proc.callback(null, result)

            } else {

                //we got an incomplete user object back.... we can't reliably generate a cookie with this.

                return proc.callback(codes.INVALID_USER, null);

            }

        }

    };

    /**
     * @param user { User }
     */
    var setUser = function (user) {
        if (user && user instanceof User) {
            proc.user = user;
        }
    };


    /**
     * @return  { User }
     */
    var getUser = function () {
        return proc.user;
    };


    /**
     * @param req { Request }
     */
    var setRequest = function (req) {
        if (req) {
            proc.req = req;
        }
    };


    /**
     * @return  { Request }
     */
    var getRequest = function () {
        return proc.req;
    };


    /**
     * @description Determines whether the appropriate conditions exist for the action to executed.
     *
     * @return {Boolean} - true if all preconditions are met, false otherwise.
     */
    var actionPreCondition = function () {

        if (!proc || !proc.user || !proc.req) {

            return false;

        } else if (!proc.user.getUsername() || !proc.user.getPassword() || !proc.user.getJurisdiction()) {

            return false;

        } else if (!proc.callback || !(proc.callback instanceof Function) || proc.callback.length !== 2) {
            return false;
        }

        return true;
    };

    proc.actionPreCondition       = actionPreCondition;
    proc.handleAuthActionResponse = handleAuthActionResponse;

    that.setUser    = setUser;
    that.getUser    = getUser;
    that.setRequest = setRequest;
    that.getRequest = getRequest;
    that.doAction   = doAction;


    return that;

}


module.exports = {LoginAction: LoginAction};