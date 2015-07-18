/**
 * Generated On: 2015-7-18
 * Class: User
 * Description: Describes a user object in the system.
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

    this.username     = username;
    this.password     = password;
    this.clinicianId  = clinicianId;
    this.clinic       = clinic;
    this.jurisdiction = juri;
    this.roles        = roles;

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

module.exports = {User: User};