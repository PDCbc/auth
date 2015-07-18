/**
 * Generated On: 2015-7-17
 * Class: NotImplementedError
 */

var _message = null;

function NotImplementedError(message) {

    this.message = message;
    this.name    = "NotImplementedError";

}

NotImplementedError.prototype = Error.prototype;


module.exports = {NotImplementedError: NotImplementedError};