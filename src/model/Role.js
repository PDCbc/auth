/**
 * Generated On: 2015-7-18
 * @class Role
 */

var Entity = require('./Entity').Entity;

/**
 * @param name {String} the name of the role.
 * @constructor
 */
function Role(name) {

    Entity.call(this, name);
    this.name = name || null;

}

// inherit from Entity object.
Role.prototype = new Entity();

/**
 * @description determines if the Role object is well formed. Well-formed means that the name and identity are both set to non-empty strings.
 *
 * @returns {boolean} true if the role is well formed, false otherwise.
 */
Role.prototype.isWellFormed = function () {

    if (!this.name || !this.identity) {

        return false;

    }else if(typeof this.name !== 'string' || typeof this.identity !== 'string'){

        return false;

    }

    return true;
};

/**
 * @documetation this uses the definition of isWellFormed() because they are the same for a role.
 *
 * @returns {boolean} true if the role object is completely specified, false otherwise.
 */
Role.prototype.isComplete = function () {

    return this.isWellFormed();

};

/**
 *
 * @throws {TypeError} if the input parameter, n, is not a valid string, or it is the empty string.
 *
 * @param n {string} the string to set the role's name and identity to.
 */
Role.prototype.setName = function (n) {

    if(!n || typeof n !== "string"){

        throw new TypeError("Role.setName(String) expects exactly one string argument.");

    }else{

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

};


module.exports = {Role: Role};