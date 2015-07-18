/**
 * Generated On: 2015-7-18
 * Class: DACSAdapter
 */

var AccessControlSystem = require('../AccessControlSystem').AccessControlSystem;

function DACSAdapter(proc) {

    proc = proc || {};

    var that = AcessControlSystem();

    /**
     * @param user  { User }
     * @param next { Function }
     */
    var getUser = function (user, next) {

        //TODO: Implement Me 

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

    that.getUser      = getUser;
    that.getRoles     = getRoles;
    that.getCookie    = getCookie;
    that.unbakeCookie = unbakeCookie;

    return that;

}

module.exports = {DACSAdapter: DACSAdapter};