/**
 * Contains error codes for communicating between
 * async funtions.
 *
 * Created by sdiemert on 15-07-18.
 */

//Action Error Codes

//used when the preconditions for an action to be executed are not met.
module.exports.ERR_FAILED_ACTION_PRECONDITION = "ERR_FAILED_ACTION_PRECONDITION";


//AuthenicateAction Error Codes

//used when the AuthenticateAction was unable to authenticate the user.
module.exports.ERR_FAILED_TO_AUTHENTICATE = "ERR_FAILED_TO_AUTHENTICATE_USER";


//General Error Codes

//Failed precondition
module.exports.ERR_FAILED_PRECONDITION = "ERR_FAILED_PRECONDITION";

//Authentication failed
module.exports.AUTH_FAILED = "AUTH_FAILED";

module.exports.FETCH_PRIVATE_DATA_FAILED = "FETCH_PRIVATE_DATA_FAILED";




