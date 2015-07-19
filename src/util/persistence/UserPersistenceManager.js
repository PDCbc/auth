/**
 * Generated On: 2015-7-18
 * Class: UserPersistenceManager
 * Description: Handles persistence of user objects within the AccessControlSystem.
 */

var PersistenceManager = require('./PersistenceManager').PersistenceManager;
var User               = require('../../model/User').User;
var DACSAdapter        = require("./dacs/DACSAdapter").DACSAdapter;
var CallbackInvalidError = require("../error/CallbackInvalidError").CallbackInvalidError;
var logger             = require("../logger/Logger").Logger("UserPersistenceManager");
var util               = require('util');
var error              = require('../Codes.js');

function UserPersistenceManager(proc) {

    proc = proc || {};

    var that = PersistenceManager();

    //link to DACS the access control system we are plugging into.
    proc.acs = DACSAdapter();

    /**
     * @documentation creates a Cookie object from the user object and any extra properties that are required.
     *
     * @param user  {User} Additional properties/parameters to use
     * @param next {Function} Called when the cookie generation is complete, has signature next(err, result).
     *  If cookie generation was successful err will be null, result will contain a UserCookie object.
     *  If cookie generation failed err will contain a code, the result will be null;
     *  See defintions of codes codes in Codes.js
     */
    var asCookie = function (user, next) {

        //TODO: Implement Me 

    };


    /**
     * @documentation populates a user object with any fields that it may be missing.
     *
     * @precondition userIsValid : The user object is defined and minimally contains a valid username, password, and jurisdiction.
     * @precondition callbackSet : The response callback (next) is a function that we can pass our response too.
     * @precondition callbackArguments : The response callback (next) has 2 arguments.
     *
     * @param user { User } The user to popluate from the access control system.
     * @param next { Function } Called when the population is complete, has signature next(err, result).
     *  If population was successful, err will be null, result will contain the User object.
     *  If population failed, err will contain an codes code, result will be null.
     *  See defintions of codes codes in Codes.js
     */
    var populate = function (user, next) {

        if (!proc.populatePrecondition(user, next)) {

            logger.warn("UserPersistenceManager.populate(user, next) : " + error.ERR_FAILED_PRECONDITION);
            return next(error.ERR_FAILED_PRECONDITION, null);

        }

        //if we get to here we know that we have satisfied all preconditions.

        logger.success("populate()" + util.inspect(user));

        proc.acs.getUser(user, function (err, result) {

            //handle response from the AccessControlSystem.

            if (err) {

                return next(err, null);

            } else {

                return next(null, result);
            }

        });

    };

    /**
     * @param user { User }
     * @param next { Function }
     */
    var save = function (user, next) {
        //TODO: Implement Me 

    };


    /**
     * @documentation: returns a user object derived from the cookie string with private data filled out.
     *
     * @param cookie { String }
     * @param next { Function }
     */
    var fromCookie = function (cookie, next) {
        //TODO: Implement Me 

    };

    /**
     */
    var getAllUsers = function () {
        //TODO: Implement Me 

    };

    /**
     * @documentation Determines if the the required preconditions for the populate() method are met.
     *
     * @param user {User} - The user object that popluate is operating on.
     * @param next {Function} - The callback that the populate() will call when it is complete.
     *
     * @throws {CallbackInvalidError} if the next function is invalid.
     *
     * @return {Boolean} - true if the preconditins are met, false otherwise.
     */
    var populatePrecondition = function (user, next) {

        //check that the user is valid.

        if (!user || !(user instanceof User) || !user.isWellFormed()) {

            return false;

        } else if (!proc.acs) {

            return false

        }

        if (!(next instanceof Function) || !next.length) {

            throw new CallbackInvalidError("Precondition for UserPersistenceManager.populate() failed, callback is not a valid function.");

        } else if (next.length !== 2) {

            throw new CallbackInvalidError("Precondition for UserPersistenceManager.populate() failed, callback does not have 2 arguments as required.");

        }

        return true;

    };

    proc.populatePrecondition = populatePrecondition;

    that.UserPersistenceManager = UserPersistenceManager;
    that.asCookie               = asCookie;
    that.populate               = populate;
    that.save                   = save;
    that.fromCookie             = fromCookie;
    that.getAllUsers            = getAllUsers;

    return that;

}

module.exports = {UserPersistenceManager: UserPersistenceManager};