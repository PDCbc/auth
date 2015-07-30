/**
 * Generated On: 2015-7-18
 * @class ControlledEntity
 * @description An entity that has aspects controlled by the system. Ex. groups or users can have their roles controlled.
 */

var Entity = require('./Entity').Entity;
var Role = require('./Role').Role;

function ControlledEntity(id, roles) {

    Entity.call(this, id);

    this.roles = roles || [];

}

ControlledEntity.prototype = new Entity();

/**
 * @return  {Array}
 */
ControlledEntity.prototype.getRoles = function () {
    return this.roles;
};


/**
 * @description sets the internal role's Array, this will overwrite an existing roles.
 *
 * @throws {TypeError} if the input is not a valid Array or it is an Array that contains objects other than roles.
 *
 * @param roles {Array} the array to set the roles to, must contain only Role objects.
 */
ControlledEntity.prototype.setRoles = function (roles) {

    if(!roles || !(roles instanceof Array)){

        throw new TypeError("ControlledEntity.setRoles(Array) expects exactly 1 parameter of type Array that contains Role types");

    }

    for(var r = 0; r < roles.length; r++){

        if(!roles[r] || !(roles[r] instanceof Role)){

            throw new TypeError("ControlledEntity.setRoles(Array) expects exactly 1 parameter of type Array that contains Role types");

        }

    }

    this.roles = [];

    for(r = 0; r < roles.length; r++){

       this.addRole(roles[r]);

    }

};

/**
 * @description adds a role to the Entity's list of roles.
 *
 * @precondition validRole : The role input is non-null and is well formed.
 *
 * @throws {TypeError} if the input parameter is not a valid and well formed Role object.
 *
 * @param r { Role }
 */
ControlledEntity.prototype.addRole = function (r) {

    if (!r || !(r instanceof Role) ||!r.isWellFormed() ) {

        throw new TypeError('ControlledEntity.addRole(Role) expects a single well-formed Role type parameter');

    } else {

        this.roles = this.roles || [];  //init the roles array if it isn't already
        this.roles.push(r);

    }

};

module.exports = {ControlledEntity: ControlledEntity};