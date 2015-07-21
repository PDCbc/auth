/**
 * Generated On: 2015-7-18
 * @class Role
 */

var Entity = require('./Entity').Entity;

function Role(name) {

    Entity.call(this, name);
    this.name = name;

}

Role.prototype = new Entity();

/**
 *
 * @returns {boolean} true if the role is well formed, false otherwise.
 */
Role.prototype.isWellFormed = function () {

    if (!this.name || !this.identity) {

        return false;

    }

    return true;
};

/**
 * @documetation this uses the definition of isWellFormed() becuase they are the same for a role.
 *
 * @returns {boolean} true if the role object is completely specified, false otherwise.
 */
Role.prototype.isComplete = function () {

    return this.isWellFormed();

};

/**
 *
 * @param n {string}
 */
Role.prototype.setName = function (n) {

    if (n) {
        this.name     = n;
        this.identity = n;
    }

};

/**
 *
 * @returns {string}
 */
Role.prototype.getName = function () {
    return this.name;
}


module.exports = {Role: Role};