/**
 * Generated On: 2015-7-18
 * Class: Role
 */

var NotImplementedError = require('NotImplementedError');

var Entity = require('Entity').Entity;

function Role(name) {

    Entity.call(this, name);
    this.name = name;

}

Role.prototype = new Entity();

module.exports = {Role: Role};