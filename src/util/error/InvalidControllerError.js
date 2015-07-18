/**
 * Generated On: 2015-7-17
 * Class: InvalidControllerError
 */

function InvalidControllerError(message) {

    this.message = message;
    this.name    = "InvalidControllerError";

}

InvalidControllerError.prototype = Error;

module.exports = {InvalidControllerError: InvalidControllerError};