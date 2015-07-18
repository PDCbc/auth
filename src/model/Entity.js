/**
 * Generated On: 2015-7-18
 * Class: Entity
 */

var NotImplementedError = require('../util/error/NotImplementedError');

function Entity(id) {

    this.identity = id;

}

/**
 * @return  {String}
 */
Entity.prototype.getIdentity = function () {
    throw 'AbstractMethodNotImplementedError';

};

/**
 * @param i {String}
 */
Entity.prototype.setIdentity = function (i) {
    throw 'AbstractMethodNotImplementedError';

};

/**
 * @documentation: Compares two entities and determines if they are equivalent based on their identity field.
 *
 *
 * @param e { Entity }
 * @return  {Boolean}
 */
Entity.prototype.isEqual = function (e) {
    throw 'AbstractMethodNotImplementedError';

};

module.exports = {Entity: Entity};