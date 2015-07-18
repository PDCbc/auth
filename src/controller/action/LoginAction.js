/**
 * Generated On: 2015-7-17
 * Class: LoginAction
 */

var Action = require('Action').Action;

var logger = require("../../util/logger/Logger").Logger("LoginAction");

var User = require("../../model/User").User;

function LoginAction(username, password, juri, req, proc) {

    proc = proc || {};

    var that = Action();

    proc.req  = req;
    proc.user = User(username, password, juri);

    /**
     * @param next {Function} - to call when the action is complete.
     */
    var doAction = function (next) {


    };

    /**
     * @param user { User }
     */
    var setUser = function (user) {
        proc.user = user;
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
        proc.req = req;
    };


    /**
     * @return  { Request }
     */
    var getRequest = function () {
        return proc.req;
    };


    /**
     * @return  {Boolean}
     */
    var actionPreCondition = function () {
        //TODO: Implement Me 

    };

    that.setUser            = setUser;
    that.getUser            = getUser;
    that.setRequest         = setRequest;
    that.getRequest         = getRequest;
    proc.actionPreCondition = actionPreCondition;

    return that;

}


module.exports = {LoginAction: LoginAction};