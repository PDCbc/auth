/**
 * Generated On: 2015-7-17
 * @class VerifyAction
 */

var util                   = require('util');
var Action                 = require('./Action').Action;
var codes                  = require("../../util/Codes");
var UserCookie             = require("../../model/UserCookie").UserCookie;
var User                   = require("../../model/User").User;
var CallbackInvalidError   = require("../../util/error/CallbackInvalidError").CallbackInvalidError;
var UserPersistenceManager = require("../../util/persistence/UserPersistenceManager").UserPersistenceManager;
var logger                 = require("../../util/logger/Logger").Logger("VerifyAction");

function VerifyAction(cookieString, request, proc) {

    proc = proc || {};

    var that = Action(proc);

    proc.userCookie = new UserCookie(new User(), cookieString, null);
    proc.req        = request || null;
    proc.upm        = UserPersistenceManager();
    proc.callback   = null;

    /**
     * @description verifies that the cookie string provided to the object is a valid cookie and gets private data for the user associated with the cookie.
     *
     * @precondition userCookieValid : the proc.userCookie object is a valid UserCookie object, note this need not be well-formed, but it must have the cookie string.
     * @precondition requestValid : the proc.req object is a valid and well formed Request object.
     * @precondition callbackValid : the next callback is a valid function that takes exactly 2 arguments.
     * @precondition userPersistenceAvailable : the proc.upm contains a valid UserPersistenceManager object.
     *
     * @param next {Function} Callback for when we are done with the action, has signature next(err, result}.
     *  If the action fails, the err will be set and result will be null.
     *  If the action is successful, the err will be null and result will contain a populated UserCookie object.
     *  See Codes.js for err code definitions.
     */
    var doAction = function (next) {

        if (!proc.actionPreCondition(next)) {

            logger.warn("doAction(Function) failed precondition(s)");
            return next(codes.ERR_FAILED_ACTION_PRECONDITION, null);

        }

        proc.callback = next;

        //set the IP from the request.
        proc.userCookie.setIP(proc.req.getSourceIP());


        proc.upm.fromCookie(proc.userCookie, proc.handleFromCookieResponse);

    };

    var handleFromCookieResponse = function (err, result) {

        //we expect that the result is a valid UserCookie object.

        if(err){

            logger.warn("handleFromCookieResponse(String, UserCookie) received an error: "+ err);
            return proc.callback(err, null);

        }

        //Check that the source IP and the cookie's decrypted IP
        //line up, if they don't likely got a MiM attack.
        //respond without any data.

        if(result.getIP() !== proc.req.getSourceIP()){

            logger.warn("handleFromCookieResponse(String, UserCookie) received an IP from cookie that was not consistent with the source IP of the request, returning code: "+codes.INCONSISTENT_IP);
            return proc.callback(codes.INCONSISTENT_IP, null);

        }else if(!result.isComplete()) {

            logger.warn("handleFromCookieResponse(String, UserCookie) received an incomplete UserCookie object, returning code: " + codes.DECRYPT_COOKIE_FAILED);
            return proc.callback(codes.DECRYPT_COOKIE_FAILED, null);

        }

        //otherwise, pass any errors or results back up the chain.
        return proc.callback(err, result);

    };

    /**
     * @param cookie {String}
     */
    var setCookie = function (cookie) {

        if (cookie && proc.userCookie) {

            proc.userCookie.setCookieString(cookie);

        }
    };


    /**
     * @return  {String}
     */
    var getCookie = function () {

    };


    /**
     * @return  {UserCookie}
     */
    var getUserCookie = function () {
        return proc.userCookie;
    };


    /**
     * @return {Request}
     */
    var getRequest = function () {
        return proc.req;
    };


    /**
     * @param req {Request} the object to set the internal request object to.
     */
    var setRequest = function (req) {

        if (req) {
            proc.req = req;
        }

    };


    /**
     * @description determines if the preconditions for executing this action are met.
     *
     * @param next {Function} the callback function, we need to check this to make sure it is a valid function with arity 2.
     *
     * @throws {CallbackInvalidError} when the next callback function is invalid.
     *
     * @return  {Boolean} true if the preconditions are met, false otherwise.
     */
    var actionPreCondition = function (next) {

        if (!next || !(next instanceof Function) || next.length !== 2) {

            //FAILED precondition callbackValid.

            throw new CallbackInvalidError("VerifyAction.doAction(next) requires that the next parameter be a callback function that takes exactly 2 arguments.");

        } else if (!proc.userCookie || !(proc.userCookie instanceof UserCookie) || !proc.userCookie.getCookieString() || typeof proc.userCookie.getCookieString() !== 'string') {

            logger.info(util.inspect(proc.userCookie));
            //FAILED precondition userCookieValid.

            return false;

        } else if (!proc.req || !proc.req.isWellFormed()) {

            logger.info(util.inspect(proc.request));
            //FAILED precondition requestValid.

            return false;

        } else if (!proc.upm) {

            logger.info(proc.upm.name);
            logger.info(util.inspect(proc.upm));
            //FAILED userPersistenceAvailable

            return false;

        } else {

            //PASSED preconditions.

            return true;
        }

    };

    proc.actionPreCondition       = actionPreCondition;
    proc.handleFromCookieResponse = handleFromCookieResponse;

    that.doAction      = doAction;
    that.setCookie     = setCookie;
    that.getCookie     = getCookie;
    that.getUserCookie = getUserCookie;
    that.getRequest    = getRequest;
    that.setRequest    = setRequest;

    return that;

}


module.exports = {VerifyAction: VerifyAction};