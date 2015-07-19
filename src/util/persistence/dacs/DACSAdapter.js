/**
 * Generated On: 2015-7-18
 * Class: DACSAdapter
 *
 * Description: Adapter to the DACS access control system
 */

var AccessControlSystem  = require('../AccessControlSystem').AccessControlSystem;
var CallbackInvalidError = require("../../error/CallbackInvalidError").CallbackInvalidError;
var codes           = require("../../Codes");
var User            = require("../../../model/User").User;
var UnixCommandLine = require("../../external/UnixCommandLine").UnixCommandLine;
var logger          = require("../../logger/Logger").Logger("DACSAdapter");

function DACSAdapter(proc) {

    proc = proc || {};

    var that = AccessControlSystem();

    proc.ucl = UnixCommandLine();

    /**
     * @documentation Authenticates the user object, and then populates it with private data from DACS.
     *
     * @precondition userIsValid : The user object that was passed in is well-formed, contains username, password, and juridiction.
     * @precondition callbackIsValid : The next callback is a function that takes 2 arguments.
     * @precondition federationSet : The federation is set in process.env.FEDERATION
     * @precondition rolefileSet : The path to the role file is available via process.env.ROLEFILE.
     *
     * @param user  { User } - The user to get we are fetching information for.
     * @param next { Function } - The callback to send the data back in. Has signature next(err, result)
     *  If successfully fetched user information, the err argument will be null and result will contain a User object.
     *  If failure to fetch user information, the err arugment will have an codes code and result will be null.
     *  See ErrorCode.js for codes code definitions.
     */
    var getUser = function (user, next) {

        if (!proc.getUserPrecondition(user, next)) {

            return next(codes.ERR_FAILED_ACTION_PRECONDITION, null);

        }

        //if we get here we know that we have met all of the preconditions.

        proc.doDacsAuth(user, function (code, result) {

            if (code === codes.AUTH_FAILED) {

                return next(code, null);

            } else {

                proc.doDacsFetchPrivateData(user, function (code, result) {

                    return next(code, result);

                });

            }

        });

    };

    var doDacsFetchPrivateData = function (user, next) {

        var cmd = "dacspasswd "; //command to get private data.

        cmd += " -uj " + user.getJurisdiction() + " "; //the jurisdiction the user is logging into.
        cmd += "-pdg ";
        cmd += user.getUsername();

        proc.ucl.exec(cmd, null, function (code, stdout, stderr) {

            var data = null;

            if (code !== null) {

                return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

            } else {

                try {
                    //private data is stored as JSON strings, we can parse them.
                    data = JSON.parse(stdout);

                    //augment the user object with the new private data.
                    user.setClinicianId(data.clinician);
                    user.setClinic(data.clinic);
                    return next(null, user);

                } catch (e) {

                    return next(codes.FETCH_PRIVATE_DATA_FAILED, null);

                }

            }

        });

    };

    var doDacsAuth = function (user, next) {

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

            logger.warn(code);
            logger.success(stdout);
            logger.error(stderr);

            if (code) {

                return next(codes.AUTH_FAILED, null);

            } else {

                //roles (if any) should be in stdout, they should be parsable csv.



                return next(null, user);

            }

        });

    };

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

    var getRolesPrecondition  = function (user, next) {

        if (!user || !user.isWellFormed()) {

            return false;

        } else if (!next || !(next instanceof Function) || next.length !== 2) {

            throw new CallbackInvalidError("DACSAdapter.getRoles(user, next) precondition failed, argument next must be a function with 2 args");
        }

        return true;

    };


    /**
     * @documentation returns a cookie based on the user and extra properties
     *
     * @param user  { User }
     * @param props  {Object}
     * @param next { Function }
     */
    var getCookie = function (user, props, next) {

        //TODO: Implement Me 

    };

    /**
     * @documentation returns the data elements that were baked into the cookie
     *
     * @param cookieString {String}
     * @param next { Function } returns the data that was baked into the cookie
     */
    var unbakeCookie = function (cookieString, next) {

        //TODO: Implement Me 

    };

    proc.getUserPrecondition    = getUserPrecondition;
    proc.getRolesPrecondition = getRolesPrecondition;
    proc.doDacsAuth             = doDacsAuth;
    proc.doDacsFetchPrivateData = doDacsFetchPrivateData;


    that.getUser      = getUser;
    that.getRoles     = getRoles;
    that.getCookie    = getCookie;
    that.unbakeCookie = unbakeCookie;

    return that;

}

module.exports = {DACSAdapter: DACSAdapter};