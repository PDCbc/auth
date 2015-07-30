/**
 * Generated On: 2015-7-18
 * @class Entity
 *
 * @description the root model object, all objects in the application's model should extend Entity via prototypical inheritance..
 */

/**
 *
 * @param id {String} the identity of the Entity.
 * @constructor
 */
function Entity(id) {

    this.identity = id || null;

}

/**
 * @return {String} the identity of the Entity.
 */
Entity.prototype.getIdentity = function () {

    return this.identity;

};

/**
 * @throws {TypeError} if the parameter, i, is not a valid String or is the empty string.
 *
 * @param i {String}
 */
Entity.prototype.setIdentity = function (i) {

    if(!i || typeof i !== 'string'){
        throw new TypeError("Entity.setidentity(String) expects a single string type parameter.");
    }else{
        this.identity = i;
    }

};

/**
 * @description Determines whether the object is well formed. Must be implemented by sub-objects.
 *
 * @return { Boolean } true if the entity is well formed, false otherwise.
 */
Entity.prototype.isWellFormed = function () {
    throw 'AbstractMethodNotImplementedError';
};

/**
 * @description checks to see if the Entity is complete. The definition of completeness
 *  must be changed for sub-objects.
 *
 * return {Boolean} true if the Entity is considered to be "complete", false otherwise.
 */
Entity.prototype.isComplete = function () {

    if(this.identity){
        return true;
    }else{
        return false;
    }
};

module.exports = {Entity: Entity};