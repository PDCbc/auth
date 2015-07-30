/**
 * Generated On: 2015-7-17
 * @class CallbackInvalidError
 */

function CallbackInvalidError(message) {

    this.message = message;
    this.name    = "CallbackInvalidError";

}

CallbackInvalidError.prototype = Error;

module.exports = {CallbackInvalidError: CallbackInvalidError};