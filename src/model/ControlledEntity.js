/**
 * Generated On: 2015-7-18
 * Class: ControlledEntity
 * Description: An entity that has aspects controlled by the system. Ex. groups or users can have their roles controlled.
 */

var Entity = require('./Entity').Entity;

function ControlledEntity(id, roles) {

    Entity.call(this, id)

    this.roles = roles || [];

}

ControlledEntity.prototype = new Entity();

/**
 * @return  {Array}
 */
ControlledEntity.prototype.getRoles = function () {
    throw 'AbstractMethodNotImplementedError';

};


/**
 * @param roles {Array<Role>}
 */
ControlledEntity.prototype.setRoles = function (roles) {
    throw 'AbstractMethodNotImplementedError';

};


/**
 * @param r { Role }
 */
ControlledEntity.prototype.addRole = function (r) {
    throw 'AbstractMethodNotImplementedError';

};


/**
 * @documentation: Removes the specified role (if it exists) from the roles for this entity.
 * @param r { Role }
 */
ControlledEntity.prototype.removeRole = function (r) {
    throw 'AbstractMethodNotImplementedError';

};


module.exports = {ControlledEntity: ControlledEntity};