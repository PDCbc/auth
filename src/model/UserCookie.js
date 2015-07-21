/**
 * Generated On: 2015-7-18
 * @class UserCookie
 * @description Wraps a user object and provides extra functions cookie management.
 *
 */

var Entity = require('./Entity').Entity;
var User   = require("./User").User;

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
 * @description Determines if the UserCookie object has all of its fields set.
 * @return {Boolean}
 */
UserCookie.prototype.isWellFormed = function () {

    if (!this.user || !(this.user instanceof User) || !this.user.isWellFormed()) {
        return false;
    }

    return true;

};

/**
 * @description Determines if all of the fields are complete and correctly typed for the object.
 * @returns {boolean} true if all fields are complete, false otherwise.
 */
UserCookie.prototype.isComplete = function () {

    if (!this.isWellFormed()) {

        return false;

    } else if (!this.user.isComplete()) {

        return false;

    } else if (!this.ip || typeof this.ip !== "string") {

        return false;

    } else if (!this.cookieString || typeof this.cookieString !== "string") {

        return false;

    } else {

        return true;

    }
};


module.exports = {UserCookie: UserCookie};