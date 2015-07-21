/**
 * Generated On: 2015-7-18
 * @class User
 * @description Describes a user object in the system.
 */

var util             = require('util');
var roles            = require('./Role');
var ControlledEntity = require('./ControlledEntity').ControlledEntity;
var logger           = require("../util/logger/Logger").Logger("User");

/**
 * Creates a User object.
 *
 * @param username
 * @param password
 * @param juri
 * @param clinicianId
 * @param clinic
 * @param roles
 * @constructor
 */
function User(username, password, juri, clinicianId, clinic, roles) {

    //set up super class
    ControlledEntity.call(this, clinicianId);

    this.username     = username || null;
    this.password     = password || null;
    this.clinicianId  = clinicianId || null;
    this.clinic       = clinic || null;
    this.jurisdiction = juri || null;

}

User.prototype = new ControlledEntity();

/**
 * @return  {String}
 */
User.prototype.getUsername = function () {
    return this.username;
};


/**
 * @param uname {String}
 */
User.prototype.setUsername = function (uname) {
    if (uname) {
        this.username = uname;
    }
};


/**
 * @return  {String}
 */
User.prototype.getClinicianId = function () {
    return this.clinicianId;
};


/**
 * @param cid {String}
 */
User.prototype.setClinicianId = function (cid) {
    if (cid) {
        this.clinicianId = cid;
        this.identity    = cid;
    }
};


/**
 * @return  {String}
 */
User.prototype.getClinic = function () {
    return this.clinic;
};


/**
 * @param cid {String}
 */
User.prototype.setClinic = function (cid) {
    if (cid) {
        this.clinic = cid;
    }
};


/**
 * @return  {String}
 */
User.prototype.getJurisdiction = function () {
    return this.jurisdiction;
};


/**
 * @param jid {String}
 */
User.prototype.setJurisdiction = function (jid) {
    if (jid) {
        this.jurisdiction = jid;
    }
};

/**
 * @returns { String } - The user's password.
 */
User.prototype.getPassword = function () {
    return this.password;
};

User.prototype.setPassword = function(pass){
    if(pass){
        this.password = pass;
    }

};

/**
 * @description Determines if the user object is well formed. This function checks to see whether user has a username, password, and jurisdiction.
 *
 * @return {Boolean} true if this User is well formed, false otherwise.
 */
User.prototype.isWellFormed = function () {

    if (!this.username || !this.password || !this.jurisdiction) {
        return false
    } else {
        return true;
    }

};

/**
 * return {Boolean} true if the user object has all of its fields set, false otherwise.
 */
User.prototype.isComplete = function () {

    if (!this.username || !this.clinicianId || !this.identity || !this.clinic || !this.password || !this.jurisdiction) {

        return false;

    } else if (!this.roles) {

        return false;

    }

    //check that each role of the user is well formed.
    for (var r = 0; r < this.roles.length; r++) {
        if (!this.roles[r].isComplete()) {
            return false;
        }
    }

    return true;

};

module.exports = {User: User};