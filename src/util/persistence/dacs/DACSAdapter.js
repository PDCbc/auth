/**
 * Generated On: 2015-7-18
 * @class DACSAdapter
 *
 * @description Adapter to the DACS access control system
 */

var AccessControlSystem  = require('../AccessControlSystem').AccessControlSystem;
var CallbackInvalidError = require("../../error/CallbackInvalidError").CallbackInvalidError;
var codes                = require("../../Codes");
var User                 = require("../../../model/User").User;
var UserCookie           = require("../../../model/UserCookie").UserCookie;
var UnixCommandLine      = require("../../external/UnixCommandLine").UnixCommandLine;
var logger               = require("../../logger/Logger").Logger("DACSAdapter");
var Role                 = require("../../../model/Role").Role;
var util                 = require('util');

function DACSAdapter(proc) {

    proc = proc || {};

    var that = AccessControlSystem();

    proc.ucl = UnixCommandLine();

    /**
     * @description Authenticates the user object, and then populates it with private data from DACS.
     *
     * @precondition userIsValid : The user object that was passed in is well-formed, contains username, password, and juridiction.
     * @precondition callbackIsValid : The next callback is a function that takes 2 arguments.
     * @precondition federationSet : The federation is set in process.env.FEDERATION
     * @precondition rolefileSet : The path to the role file is available via process.env.ROLEFILE.
     *
     * @param user  { User } - The user to get we are fetching information for.
     * @param next { Function } - The callback to send the data back in. Has signature next(err, result)
     *  If successfully fetched user information, the err argument will be null and result will contain a User object.
     *  If failure to fetch user information, the err argument will have an codes code and result will be null.
     *  See Codes.js for codes code definitions.
     */
    var getUser = function (user, next) {

        if (!proc.getUserPrecondition(user, next)) {

            logger.warn("getUser(User, Function) failed preconditions, returning " + codes.ERR_FAILED_PRECONDITION);
            return next(codes.ERR_FAILED_PRECONDITION, null);

        }

        //if we get here we know that we have met all of the preconditions.

        proc.doDacsAuth(user, function (code, result) {

            if (code) {

                logger.warn("doDacsAuth.callback(code, result) received authentication failed, returning: " + code);

                return next(code, null);

            } else {

                proc.doDacsFetchPrivateData(user, function (code, result) {

                    if (code) {

                        logger.warn("doDacsFetchPrivateData.callback(code, result) received error: " + code + ", returning this code.");
                        return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

                    } else {

                        return next(null, result);

                    }

                });

            }

        });

    };

    /**
     * @description Fetches a user's private data from dacs via the UnixCommandLine interface.
     *
     * @param user {User}
     * @param next {Function}
     */
    var doDacsFetchPrivateData = function (user, next) {

        if (!next || !(next instanceof Function) || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.doDacsAuth(user, next) requires that next parameter be a function and take 2 arguments.")

        }

        if (!user || !(user instanceof User) || !user.isWellFormed()) {

            logger.warn("doDacsAuth(user, next) received invalid User input for parameter user, returning null.");
            return next(codes.ERR_FAILED_PRECONDITION, null)

        }

        var cmd = "dacspasswd "; //command to get private data.

        cmd += " -uj " + user.getJurisdiction() + " "; //the jurisdiction the user is logging into.
        cmd += "-pdg ";
        cmd += user.getUsername();

        proc.ucl.exec(cmd, null, function (code, stdout, stderr) {


            if (code !== null) {

                return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

            } else {

                try {

                    user = proc.assignPrivateData(user, stdout);

                    if (!user) {

                        return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

                    } else {

                        return next(null, user);

                    }

                } catch (e) {

                    return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

                }

            }

        });

    };

    /**
     * @description assigns private data fields that came out of DACS to the user. This method expects private data to be in a JSON string
     *  with structure like: { "clinician": String, "clinic" : String }. Any other fields will be ignored.
     *
     * @param user {User} the user object to added the private data to.
     * @param stdout {String} the string that will contain the private data, should parsable as JSON.
     * @returns {User} the user with the private data fields added. If parsing private data fails or the private data is incomplete, null is returned.
     */
    var assignPrivateData = function (user, stdout) {

        if (!user || !(user instanceof User) || !stdout || typeof stdout !== "string") {

            return null;

        }

        try {

            //private data is stored as JSON strings, we can parse them.
            var data = JSON.parse(stdout);

            //check that appropriate fields exist
            if (!data.clinician || !data.clinic) {
                return null;
            }

            //augment the user object with the new private data.
            user.setClinicianId(data.clinician);
            user.setClinic(data.clinic);

            return user;

        } catch (e) {

            return null;

        }


    };

    /**
     * @description Executes the dacsauth via the UnixCommandLine interface. dacsauth authenicates a user and returns its roles.
     *
     * @precondition userIsValid : The user parameter is a valid User object that is well formed.
     * @precondition nextIsValid : The next callback function is a function that takes 2 arguments.
     *
     * @param user {User} The user object to authenticate
     * @param next  {Function} the function to call dacsauth is complete, has signature next(err, result).
     *  If dacsauth successfully authenticates the user err will be null and the result will be the user with roles populated.
     *  If dacsauth failed, or the roles could not be determined, the err will have an error code and result will be null.
     *  See Codes.js for error code definitions.
     */
    var doDacsAuth = function (user, next) {

        if (!next || !(next instanceof Function) || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.doDacsAuth(user, next) requires that next parameter be a function and take 2 arguments.")

        }

        if (!user || !(user instanceof User) || !user.isWellFormed()) {

            logger.warn("doDacsAuth(user, next) received invalid User input for parameter user, returning null.");
            return next(codes.ERR_FAILED_PRECONDITION, null)

        }

        var cmd = "dacsauth "; //authentication command.

        cmd += "";  //verbose, set out level to debug
        cmd += "-r roles"; //use role module
        cmd += ' -vfs "[roles]dacs-kwv-fs:' + process.env.ROLEFILE + '" ';
        cmd += "-m passwd passwd required "; //use password module
        cmd += ' -vfs "[passwds]dacs-kwv-fs:/etc/dacs/federations/' + process.env.FEDERATION + "/" + user.getJurisdiction() + '/passwd"'; //specify passwd file location.
        cmd += " -fn " + process.env.FEDERATION + " "; //define the federation
        cmd += "-fj " + user.getJurisdiction() + " "; //define jurisdiction the user is logging into
        cmd += "-u " + user.getUsername() + " "; //the username to authenticate
        cmd += "-p " + user.getPassword(); //the password for the user.

        proc.ucl.exec(cmd, null, function (code, stdout, stderr) {

            //if the returned code is null, authentication was a success, otherwise auth failed.

            if (code) {

                return next(codes.AUTH_FAILED, null);

            } else {

                try {

                    //roles (if any) should be in stdout, they should be parsable csv.

                    stdout = stdout || "";

                    var roles = proc.generateRoles(stdout.trim());  //returns an array of Role objects.

                    user = proc.assignRoles(user, roles); //pushes the roles into the user object.

                    if (!user) {

                        logger.warn("doDacsAuth(user, next) got null user back from assignRoles(user, roles), returning FETCH_ROLES_FAILED");
                        return next(codes.FETCH_ROLES_FAILED, null);

                    } else {

                        return next(null, user);

                    }

                } catch (e) {

                    return next(codes.FETCH_ROLES_FAILED, null);

                }

            }

        });

    };

    /**
     * @description parses a CSV string of roles and generates Role objects.
     *
     * @param roleString {String} the comma separated string of roles.
     * @returns {Array} - Returns an Array of Role objects. Returns null if there was failure to parse.
     */
    var generateRoles = function (roleString) {

        //check for invalid input types.
        if (roleString === null || roleString === undefined || typeof roleString !== "string") {
            return null;
        }

        //check for illegal characters, if we detect them, return null.
        if (roleString.match("\n|\r")) {
            return null;
        }

        //check for the empty string, this is a special case; they have no roles.
        if (roleString === "") {
            return [];
        }

        var roles    = null;
        var toReturn = [];

        roles = roleString.split(",");

        //loop over string and generate role objects.
        for (var r = 0; r < roles.length; r++) {

            toReturn.push(new Role(roles[r]))

        }

        return toReturn;

    };

    /**
     *
     * @description Assigns the role objects in roles to the user.
     *
     * @param user {User} A user object to assign the roles to.
     * @param roles {Array}  An array of roles to assign to the user.
     * @returns {User} The user object that has its roles added. Returns null if the role could not assigned.
     */
    var assignRoles = function (user, roles) {

        if (!user || !(user instanceof User) || !roles || !(roles instanceof Array)) {

            logger.warn("assignRoles(User, Array) received invalid input objects, returning null.");
            return null;

        }

        for (var r = 0; r < roles.length; r++) {

            user.addRole(roles[r]);

        }

        return user;
    };

    /**
     * @description determines if the preconditions for getUser() are met.
     *
     * @throws {CallbackInvalidError} when the
     *
     * @param user
     * @param next
     * @returns {boolean}
     */
    var getUserPrecondition = function (user, next) {

        if (!user || !(user instanceof User) || !user.isWellFormed()) {

            return false;

        }

        if (!process.env.FEDERATION) {

            return false;

        }

        if (!process.env.ROLEFILE) {

            return false;

        }

        if (!(next instanceof Function) || !next || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.getUser(user, next) precondition failed, argument next must be a function with 2 arguments.");
        }

        return true;

    };

    /**
     * @param user { User } The user object to fetch roles for.
     * @param next { Function } The callback function, takes 2 arguments, has signature: next(err, result).
     */
    var getRoles = function (user, next) {

    };

    /**
     * @description determines if the preconditions for the getRoles() function are met.
     *
     * @throws {CallbackInvalidError} when the next argument is not a function or it does not have arity 2.
     *
     * @param user {User} must be a valid well-form User object.
     * @param next {Function} the callback function, must have arity 2.
     * @returns {boolean} true if the preconditions for getRoles() are satisfied, false otherwise.
     */
    var getRolesPrecondition = function (user, next) {

        if (!user || !user.isWellFormed()) {

            return false;

        } else if (!next || !(next instanceof Function) || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.getRoles(user, next) precondition failed, argument next must be a function with 2 args");
        }

        return true;

    };


    /**
     * @description returns a cookie based on the user and extra properties
     *
     * @precondition userIsValid : the user parameter is a valid well formed UserCookie object.
     * @precondition userHasIp   : the user parameter has an IP string accessible via the user.getIP() method.
     * @precondition userHasRoles : the user parameter has non-null roles.
     * @precondition validCallback : the next callback function is of type Function and takes exactly 2 arguments.
     * @precondition federationSet : the federation is available via process.env.FEDERATION
     *
     * @param user  { UserCookie } the object to generate a cookie for.
     * @param next { Function } the callback to call when we are done generating the cookie, has signature next(err, result).
     *  If cookie generation is successful, err will be null and result will have the populated UserCookie object.
     *  If cookie generation fails, err will be set to an error code and result will be null.
     *  See Codes.js for code definitions.
     */
    var getCookie = function (user, next) {

        if (!proc.getCookiePrecondition(user, next)) {

            return next(codes.ERR_FAILED_PRECONDITION, null);
        }

        proc.doDacsGenerateCookie(user, function (err, result) {

            return next(err, result);

        });

    };

    /**
     * @description determines if the preconditions for the getCookie() function are satisfied.
     *
     * @throws {CallbackInvalidError} if the next argument is not a function with arity 2.
     *
     * @param user {UserCookie}
     * @param next {Function}
     *
     * @returns {boolean} true if the preconditions are satisfied, false otherwise.
     */
    var getCookiePrecondition = function (user, next) {

        if (!next || !(next instanceof Function) || next.length !== 2) {

            //FAILS precondition: validCallback.

            throw new CallbackInvalidError("DACSAdapter.getCookie(user, next) expects the next argument to be a function with arity 2");

        } else if (!user || !(user instanceof UserCookie) || !user.isWellFormed()) {

            //FAILS precondition: userIsValid.

            return false;

        } else if (!process.env.FEDERATION) {

            //FAILS precondition: federationSet.

            return false;

        } else if (!user.getUser().getRoles()) {

            //FAILS precondition: userHasRoles

            return false;

        } else if (typeof user.getIP === 'undefined' || !(user.getIP instanceof Function) || !user.getIP() || typeof user.getIP() !== 'string') {

            //FAILS precondition: userHasIp

            return false;

        }

        //PASSED all preconditions

        return true;

    };

    var doDacsGenerateCookie = function (user, next) {

        var cmd = "dacscookie ";

        cmd += "-u " + process.env.FEDERATION + " ";
        cmd += ""


        next(1, null);

    };

    /**
     * @description returns the data elements that were baked into the cookie
     *
     * @param cookieString {String}
     * @param next { Function } returns the data that was baked into the cookie
     */
    var unbakeCookie = function (cookieString, next) {

        //TODO: Implement Me

    };

    proc.getUserPrecondition    = getUserPrecondition;
    proc.getRolesPrecondition   = getRolesPrecondition;
    proc.getCookiePrecondition  = getCookiePrecondition;
    proc.doDacsAuth             = doDacsAuth;
    proc.doDacsFetchPrivateData = doDacsFetchPrivateData;
    proc.doDacsGenerateCookie   = doDacsGenerateCookie;
    proc.assignRoles            = assignRoles;
    proc.generateRoles          = generateRoles;
    proc.assignPrivateData      = assignPrivateData;


    that.getUser      = getUser;
    that.getRoles     = getRoles;
    that.getCookie    = getCookie;
    that.unbakeCookie = unbakeCookie;

    return that;

}

module.exports = {DACSAdapter: DACSAdapter};