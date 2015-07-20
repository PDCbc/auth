/**
 * Generated On: 2015-7-18
 * Class: UserCookie
 * Description: Wraps a user object and provides extra functions cookie management.
 *
 */

var Entity = require('./Entity').Entity;

/**
 *
 * @param user
 * @param cookieString
 * @param ip
 * @constructor
 */
function UserCookie(user, cookieString, ip) {

    //Constructor

    this.user         = user || null;
    this.cookieString = cookieString || null;
    this.ip           = ip || null;

}

UserCookie.prototype = new Entity();

/**
 * @return  {String}
 */
UserCookie.prototype.getCookieString = function () {

    return this.cookieString;

};

/**
 * @param c {String}
 */
UserCookie.prototype.setCookieString = function (c) {

    if (c) {
        this.cookieString = c;
    }

};

/**
 * @return  {String}
 */
UserCookie.prototype.getIP = function () {

    return this.ip;

};

/**
 * @param ip {String}
 */
UserCookie.prototype.setIP = function (ip) {

    if (ip) {
        this.ip = ip;
    }

};

/**
 * @return  {User}
 */
UserCookie.prototype.getUser = function () {
    return this.user;
};

/**
 * @param user {User}
 */
UserCookie.prototype.setUser = function (user) {

    if (user && user.isWellFormed()) {
        this.user = user;
    }

};

/**
 * @documentation Determines if the UserCookie object has all of its fields set.
 * @return {Boolean}
 */
UserCookie.prototype.isWellFormed = function () {

    if (!this.user || !user.isWellFormed()) {
        return false;
    }

};

/**
 * @documentation Determines if all of the fields are complete and correctly typed for the object.
 * @returns {boolean} true if all fields are complete, false otherwise.
 */
UserCookie.prototype.isComplete = function () {

    if (!this.isWellFormed()) {

        return false;

    } else if (!this.user.isComplete()) {

        return false;

    } else if (!this.ip || typeof this.ip !== string) {

        return false;

    } else if (!this.cookie || typeof this.cookieString !== string) {

        return false;

    } else {

        return true;

    }
};


module.exports = {UserCookie: UserCookie};