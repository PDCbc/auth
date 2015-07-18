/**
 * Generated On: 2015-7-18
 * Class: UserPersistenceManager
 * Description: Handles persistence of user objects within the AccessControlSystem.
 */

var PersistenceManager = require('PersistenceManager').PersistenceManager;

var User = require('User');

function UserPersistenceManager(proc) {

    proc = proc || {};

    var that = PersistenceManager();

    /**
     * @documentation creates a Cookie object from the user object and any extra properties that are required.
     *
     * @param user  {User} Additional properties/parameters to use
     * @param next {Function} Called when the cookie generation is complete, has signature next(err, result).
     *  If cookie generation was successful err will be null, result will contain a UserCookie object.
     *  If cookie generation failed err will contain a code, the result will be null;
     *  See defintions of error codes in ErrorCodes.js
     */
    var asCookie = function (user, next) {

        //TODO: Implement Me 

    };


    /**
     * @documentation populates a user object with any fields that it may be missing.
     * @param user { User }
     * @param next { Function } Called when the population is complete, has signature next(err, result).
     *  If population was successful, err will be null, result will contain the User object.
     *  If population failed, err will contain an error code, result will be null.
     *  See defintions of error codes in ErrorCodes.js
     */
    var populate = function (user, next) {

        //TODO: Implement Me 

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

    that.UserPersistenceManager = UserPersistenceManager;
    that.asCookie               = asCookie;
    that.populate               = populate;
    that.save                   = save;
    that.fromCookie             = fromCookie;
    that.getAllUsers            = getAllUsers;

    return that;

}


module.exports = {UserPersistenceManager: UserPersistenceManager};