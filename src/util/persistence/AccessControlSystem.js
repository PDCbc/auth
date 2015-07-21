/**
 * Generated On: 2015-7-18
 * Class: AcessControlSystem
 * Description: Access Control System Adapter abstract class
 */

var logger = require('../logger/Logger').Logger("AccessControlSystem");

function AccessControlSystem(proc) {

    proc = proc || {};

    var that = {};

    /**
     * @param user  { User }
     * @param next { Function }
     */
    var getUser = function (user, next) {
        throw 'AbstractMethodNotImplementedError';
    };

    /**
     * @param user  { User }
     * @param next { Function }
     */
    var getRoles = function (user, next) {
        throw 'AbstractMethodNotImplementedError';

    };


    /**
     * @description gets a cookie that matches the User object.
     * @param user  { User }
     * @param next { Function }
     */
    var getCookie = function (user, next) {
        throw 'AbstractMethodNotImplementedError';

    };


    /**
     * @param role  { Role }
     * @param next { Function }
     */
    var getRole = function (role, next) {
        throw 'AbstractMethodNotImplementedError';

    };


    /**
     * @description returns the data elements that were baked into the cookie.
     *
     * @param cookieString {String}
     * @param next { Function }
     */
    var unbakeCookie = function (cookieString, next) {
        throw 'AbstractMethodNotImplementedError';

    };

    that.getUser      = getUser;
    that.getRoles     = getRoles;
    that.getCookie    = getCookie;
    that.getRole      = getRole;
    that.unbakeCookie = unbakeCookie;

    return that;

}

module.exports = {AccessControlSystem: AccessControlSystem};