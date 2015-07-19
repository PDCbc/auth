/**
 * Generated On: 2015-7-18
 * Class: Entity
 */

function Entity(id) {

    this.identity = id;

}

/**
 * @return  {String}
 */
Entity.prototype.getIdentity = function () {

    return this.identity;

};

/**
 * @param i {String}
 */
Entity.prototype.setIdentity = function (i) {
    throw 'AbstractMethodNotImplementedError';

};

/**
 * Deterines whether the object is well formed. Must be implemented by sub-objects.
 *
 * @return { Boolean } true if the entity is well formed, false otherwise.
 */
Entity.prototype.isWellFormed = function () {
    throw 'AbstractMethodNotImplementedError';
};

/**
 * @documentation checks to see if the Entity is complete. The definition of completeness
 *  must be defined by the appropriate sub-class.
 *
 * return {Boolean} true if the Entity is considered to be "complete", false otherwise.
 */
Entity.prototype.isComplete = function () {
    throw 'AbstractMethodNotImplementedError';
};

/**
 * @documentation: Compares two entities and determines if they are equivalent based on their identity field.
 *
 * @param e { Entity }
 * @return  {Boolean}
 */
Entity.prototype.isEqual = function (e) {
    throw 'AbstractMethodNotImplementedError';

};

module.exports = {Entity: Entity};