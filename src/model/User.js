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
    //TODO: Implement Me 

};


/**
 * @param uname {String}
 */
User.prototype.setUsername = function (uname) {
    //TODO: Implement Me 

};


/**
 * @return  {String}
 */
User.prototype.getClinicianId = function () {
    //TODO: Implement Me 

};


/**
 * @param cid {String}
 */
User.prototype.setClinicianId = function (cid) {
    //TODO: Implement Me 

};


/**
 * @return  {String}
 */
User.prototype.getClinic = function () {
    //TODO: Implement Me 

};


/**
 * @param cid {String}
 */
User.prototype.setClinic = function (cid) {
    //TODO: Implement Me 

};


/**
 * @return  {String}
 */
User.prototype.getJurisdiction = function () {
    //TODO: Implement Me 

};


/**
 * @param jid {String}
 */
User.prototype.setJurisdiction = function (jid) {
    //TODO: Implement Me 

};


module.exports = {User: User};