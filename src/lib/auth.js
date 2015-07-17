'use strict';
var async  = require('async'),
    _      = require('lodash'),
    fs     = require('fs'),
    util   = require('util'),
    logger = require('./logger');


/**
 * Removes an characters in a string might make the unix command execution
 * of dacs vulnerable to injection.
 *
 * Characters currently removed:
 *   - ';' (semicolon)
 *
 * @param s {String} - The string to sanitize. If s is not a string, an exception is thrown.
 *
 * @return {String} - The sanitized string.
 */
function sanitizeInput(s) {

    if (!s) {

        return "";

    } else if (typeof s !== 'string') {

        throw " sanitizeInput() Cannot sanitize input of non-string!";

    }

    s = s.replace(/;/gi, "");

    return s;

}

/**
 * Removes any characters in an array of strings that might make
 * unix command line execution to dacs vulnerable to injection.
 *
 * Removes characters using the sanitizeInput() method.
 *
 * @param a {Array} - An array of Strings that to be sanitized.
 *
 * @return {Array} - the sanitized array.
 */
function sanitizeInputArray(a) {

    if (!a) {

        return "";

    } else if (typeof a !== 'object') {

        throw "sanitizeInputArray() Cannot sanitize input that is non-Array or non-Object";

    }


    for (var k = 0; k < a.length; k++) {

        if (typeof a[k] === 'string') {

            try {
                a[k] = sanitizeInput(a[k]);
            } catch (e) {

                a[k] = "";

            }

        }

    }

    return a;

}

/**
 * Adds a user to DACS.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The username.
 * @param {String}   password     The user password.
 * @param {Function} next         The callback, signature (Error, Boolean).
 */
function addUser(jurisdiction, user, password, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        user         = sanitizeInput(user);
        password     = sanitizeInput(password);

        var exec       = require('child_process').exec,
            juri_opts  = '-uj ' + jurisdiction,
            pass_opts  = '-p ' + password,
            other_opts = '-a ' + user,
            command    = ['dacspasswd', juri_opts, pass_opts, other_opts].join(' ');

        exec(command, function finish(err, stdout, stderr) {

            if (err !== null) {

                // Status code is not 0.
                next(err, false);

            } else {

                next(err, true);

            }

        });

    } catch (e) {

        logger.error("auth.addUser() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }

}

/**
 * Sets the private data for the member.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The user's name.
 * @param {String}   data         The data to set, as a string. You can do `JSON.stringify()`
 * @param {Function} next         The callback.
 */
function setPrivateData(jurisdiction, user, data, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        user         = sanitizeInput(user);

        var exec         = require('child_process').exec,
            juri_opts    = '-uj ' + jurisdiction,
            private_opts = "-pds '" + data + "'", // Quote types matter here...
            command      = ['dacspasswd', juri_opts, private_opts, user].join(' ');

        exec(command, function finish(err, stdout, stderr) {

            if (err !== null) {

                // Status code is not 0.
                next(401, false);

            } else {

                next(null, true);

            }

        });

    } catch (e) {

        logger.error("auth.setPrivateData() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }

}

/**
 * Gets the private data for the member.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The user's name.
 * @param {Function} next         The callback.
 */
function getPrivateData(jurisdiction, user, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        user         = sanitizeInput(user);


        var exec         = require('child_process').exec,
            juri_opts    = '-uj ' + jurisdiction,
            private_opts = "-pdg",
            command      = ['dacspasswd', juri_opts, private_opts, user].join(' ');

        exec(command, function finish(err, stdout, stderr) {

            if (err !== null) {

                // Status code is not 0.
                next(null, stdout);

            } else {

                next(null, stdout);

            }

        });

    } catch (e) {

        logger.error("auth.getPrivateData() caught an exception: " + util.inspect(e, false, null));
        next(500, null);

    }
}

/**
 * Removes a user from DACS.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The username.
 * @param {Function} next         The callback, signature (Error, Boolean).
 */
function delUser(jurisdiction, user, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        user         = sanitizeInput(user);

        var exec       = require('child_process').exec,
            juri_opts  = '-uj ' + jurisdiction,
            other_opts = '-d ' + user,
            command    = ['dacspasswd', juri_opts, other_opts].join(' ');

        // TODO: We should probably delete their roles?
        exec(command, function finish(err, stdout, stderr) {
            if (err !== null) {
                console.error(stderr);
                // Status code is not 0.
                next(err, false);
            } else {
                next(err, true);
            }
        });

    } catch (e) {

        logger.error("auth.delUser() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }
}

/**
 * List all the users. Note: This is rather costly.
 * @param {Function} next The callback.
 */
function listUsers(next) {

    var exec       = require('child_process').exec,
        fs         = require('fs'),
        other_opts = '-l';
    async.waterfall([
        function readDirectory(cb) {
            fs.readdir(process.env.DACS + '/federations/' + process.env.FEDERATION, cb);
        },
        function filesToStats(files, cb) {
            files = files.map(function (v) {
                return process.env.DACS + '/federations/' + process.env.FEDERATION + '/' + v;
            });
            async.filter(files, function (file, callback) {
                fs.stat(file, function (err, stats) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(stats.isDirectory());
                    }
                });
            }, function (results) {
                cb(null, results);
            });
        },
        function statsToOutputs(dirs, cb) {
            // Get last item of path.
            dirs      = _.map(dirs, function (val) {
                return val.split('/').pop();
            });
            var pair  = _.map(dirs, function (dir) {
                return [dir, ['dacspasswd', '-uj ' + dir, other_opts].join(' ')];
            });
            var users = {};
            async.each(pair, function (pair, callback) {
                exec(pair[1], function (err, out) {
                    // The last item in the `out` is empty.
                    var split = out.split('\n'); // These are the usernames.
                    split.pop(); // Gets the last `''` string.
                    async.map(split, function (v, back) {
                            getRoles(v, function (err, roles) {
                                getPrivateData(pair[0], v, function (err, data) {
                                    back(err, {name: v, roles: roles, data: data});
                                });
                            });
                        },
                        function (err, with_info) {
                            users[pair[0]] = with_info;
                            callback(err);
                        });
                });
            }, function (err) {
                cb(err, users);
            });
        }
    ], function (err, data) {
        // console.log(data);
        next(err, data);
    });
}

function setRoles(jurisdiction, user, roles, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        user         = sanitizeInput(user);
        roles        = sanitizeInputArray(roles);

        readRoles(function (err, users) {

            if (err) {

                next(err);

            } else {

                users[user] = roles;
                writeRoles(users, next);

            }


        });

    } catch (e) {

        logger.error("auth.setRoles() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }
}


function readRoles(next) {

    try {

        fs.readFile(process.env.ROLEFILE, {encoding: 'utf8'}, function (err, data) {
            if (!err && data) {
                var users = {};
                _.forIn(data.split('\n'), function (v) {
                    // console.log("READ: --" + v + "--");
                    if (v.length === 0) {
                        // console.log("SKIPPED");
                        return;
                    }
                    var split       = v.split(':');
                    var roles       = split[1].split(',');
                    users[split[0]] = roles;
                });
                next(null, users);
            } else {
                next(err, null);
            }
        });

    } catch (e) {

        logger.error("auth.addUser() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }
}

function writeRoles(users, next) {

    users = sanitizeInputArray(users);

    var out = "";
    // console.log(JSON.stringify(users, null, 2));
    _.forIn(users, function (v, k) {
        // console.log("USER: --" + k + "-- ROLES --" + v + "--");
        out = out.concat(k + ':' + v.join(',') + '\n');
    });
    // console.log("START");
    // console.log(out);
    // console.log("END");
    fs.writeFile(process.env.ROLEFILE, out, {encoding: 'utf8'}, function (err) {
        next(err);
    });
}

/**
 * Uses DACS' local module.
 * Determines whether the login details are valid.
 * @param  {String}   jurisdiction The jurisdiction of the user.
 * @param  {String}   user         The username string.
 * @param  {String}   pass         The password string.
 * @param  {Function} next         The callback, signature (Error, Boolean).
 */
function checkDetails(jurisdiction, user, pass, next) {

    try {

        jurisdiction = sanitizeInput(jurisdiction);
        pass         = sanitizeInput(pass);
        user         = sanitizeInput(user);

        var exec        = require('child_process').exec,
            module_opts = '-m passwd passwd required',
            vfs_opts    = '-vfs "[passwds]dacs-kwv-fs:/etc/dacs/federations/' + process.env.FEDERATION + '/' + jurisdiction + '/passwd"',
            fed_opts    = '-fn ' + process.env.FEDERATION + ' -fj ' + jurisdiction,
            login_opts  = '-u ' + user + ' -p ' + pass,
            command     = ['dacsauth -v', module_opts, vfs_opts, fed_opts, login_opts].join(' ');

        exec(command, function finish(err, stdout, stderr) {

            // `err` is not null if the status code is not 0.
            // This would mean login failed.

            if (err) {

                //return failure to authenticate due to invalid creds.
                return next(401);

            } else {

                return next(null);
            }

        });

    } catch (e) {

        logger.error("auth.checkDetails() caught an exception: " + util.inspect(e, false, null));
        next(500);

    }
}

/**
 * Bakes a cookie for the user and passes it along. This uses `dacscookie`.
 * DACS is pretty inflexible and requires us to fetch private data instead of baking it.
 * @param {String}   user The username to bake the cookie for.
 * @param {Array}    the roles of the user.
 * @param {String}   ip   The IP address the user is originating from.
 * @param {Function} next The callback, signature (Error, String).
 */
function bakeCookie(user, roles, ip, next) {

    // TODO: Can't pass user-agent (https://dacs.dss.ca/man/dacscookie.1.html)
    //       This is because we can't decrypt it.

    try {

        user  = sanitizeInput(user);
        roles = sanitizeInputArray(roles);
        ip    = sanitizeInput(ip);

        var exec      = require('child_process').exec,
            fed_opts  = "-u " + process.env.FEDERATION,
            ip_opts   = '-ip ' + ip,
            role_opts = '-role ' + roles,
            name_opts = '-user ' + user,
            command   = ['dacscookie', fed_opts, ip_opts, name_opts].join(' ');

        // Roles aren't always included. (Some users are role-less)
        // console.log(roles);
        if (roles) {

            command = command.concat(' ' + role_opts);

        }

        exec(command, function pass(err, stdout, stderr) {

            if (err) {

                //likely failed to authenticate.
                return next(401, null);

            } else {

                return next(null, stdout.substring(0, stdout.length - 1));

            }


        });

    } catch (e) {

        logger.log(e.stack);
        logger.error("auth.bakeCookie() caught an exception: " + util.inspect(e, false, null));
        next(500, null);

    }
}

function parse(data) {

    // Example:
    // federation="PDC"
    // jurisdiction="TEST"
    // username="foo"
    // identity="PDC::TEST:foo"
    // concise_identity='{u="PDC::TEST:foo",ip="10.0.2.2",e="1424155577"}'
    // ip_address="10.0.2.2"
    // roles=""
    // expires_secs="1424155577" (Tue Feb 17 06:46:17 2015 UTC)
    // auth_style="generated"
    // valid_for="acs"
    // version="1.4"

    var user = {};

    try {

        var byLine = data.trim().split('\n');

        _.each(byLine, function (line) {

            var split = line.split('='),
                key   = split[0];

            // TODO: This isn't ideal! We need to clean this!
            var upTo = split[1].substring(1, split[1].length - 1);

            if (key == "roles") {
                upTo = upTo.split(',');
            }
            user[key] = upTo;

        });

    } catch (e) {

        logger.error("Parsing DACS output generated an exception: " + util.inspect(e, false, null));
        return user;
    }

    return user;
}

/**
 * Unbakes a cookie and gives the unwrapped information. This uses `dacscookie`.
 * DACS is pretty inflexible and requires us to fetch private data instead of baking it.
 * @param {String}   cookie The cookie to unbake.
 * @param {Function} next   The callback, signature (Error, String).
 */
function unbakeCookie(cookie, next) {

    // NOTE: We don't need to sanitize the cookie input, since 
    //       it is piped into the STDIN of the dacs process and not
    //       input'd via the command line.

    try {

        if (cookie === undefined) {

            //return bad request format.
            return next(400, null);

        }

        //TODO: Check IP

        // NOTE: This is much different than `exec`.
        var spawn    = require('child_process').spawn;
        var fed_opts = ['-u', process.env.FEDERATION, '-decrypt'];
        var command  = 'dacscookie';

        var dacscookie = spawn(command, _.flatten(fed_opts));

        dacscookie.stdin.write(cookie);

        dacscookie.stdin.end();

        var stdout = "", stderr = "";

        dacscookie.stdout.on('data', function (data) {
            stdout += data;
        });

        dacscookie.stderr.on('data', function (data) {
            stderr += data;
        });

        dacscookie.on('exit', function (code, signal) {

            if (code !== 0) {

                //logger.warn("code was: "+ code+ "  error: "+ String(stderr));
                //likely means that authentication failed due to credentials 
                return next(401, null);

            } else {

                var user = parse(String(stdout));

                getPrivateData(user.jurisdiction, user.username, function (err, out) {

                    try {

                        if (!out) {

                            logger.log('No Private Data Found! ');
                            return next(401, user);

                        }

                        var privateData = JSON.parse(out);
                        user.clinic     = privateData.clinic;
                        user.clinician  = privateData.clinician;
                        return next(null, user);

                    } catch (error) {

                        err = "could not parse user information: " + error;
                        return next(500, null);

                    }

                });

            }

        });

    } catch (e) {

        logger.error("auth.unbakeCookie() caught an exception: " + util.inspect(e, false, null));
        next(500, null);

    }
}

/**
 * Uses DACS' local module.
 * Determines the user's roles.
 * @param  {String}   user The username string.
 * @param  {Function} next The callback, signature (Error, [String]).
 */
function getRoles(user, next) {

    try {

        user = sanitizeInput(user);

        var exec        = require('child_process').exec,
            module_opts = '-r roles',
            vfs_opts    = '-vfs "[roles]dacs-kwv-fs:' + process.env.ROLEFILE + '"',
            login_opts  = '-u ' + user,
            command     = ['dacsauth', module_opts, vfs_opts, login_opts].join(' ');

        exec(command, function parse(err, stdout, stderr) {

            if (err) {

                // The status code is not 0.
                logger.error('GetRoles ERROR: ' + err);
                next(err, null);

            } else {

                console.log("GETROLES --" + stdout.trim() + "--");
                console.log("GETROLES next: " + next);
                next(null, stdout.trim().split(','));

            }

        });

    } catch (e) {

        logger.error("auth.getRoles() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }
}

/**
 * Checks to see if a user has a role.
 * @param  {String}    role The role to check.
 * @return {Function}  next A middleware, signature (Error, Boolean).
 */
function hasRole(role) {

    try {

        role = sanitizeInput(role);

        return function roleCheck(req, res, next) {
            // TODO: This might need to be improved.
            var session;
            //console.log("session: ");
            //console.log(req.session);

            if (req.session.baked) {
                session = req.session.baked;
            } else {
                session = req.body.bakedCookie;
            }
            // End TODO
            unbakeCookie(session, function (err, data) {
                if (!err && data) {

                    getRoles(data.username, function check(err, roles) {

                        logger.success('got roles: ' + roles);
                        logger.warn('looking for: ' + role)

                        if (roles.indexOf(role) == -1) {
                            logger.error('Has Roles ERROR: ' + err);
                            logger.error('Role ' + role + ' not found.');
                            res.redirect('/auth/login?message="Role ' + role + ' not found"');
                        } else {
                            next();
                        }
                    });
                } else {
                    logger.error(err || 'Cookie was not baked properly');
                    res.redirect('/auth/login?message="Role ' + role + ' not found"');
                }
            });
        };

    } catch (e) {

        logger.error("auth.hasRoles() caught an exception: " + util.inspect(e, false, null));
        next(500, false);

    }
}

/**
 * Exported functions.
 */
module.exports = {
    checkDetails  : checkDetails,
    getRoles      : getRoles,
    hasRole       : hasRole,
    setRoles      : setRoles,
    bakeCookie    : bakeCookie,
    unbakeCookie  : unbakeCookie,
    listUsers     : listUsers,
    addUser       : addUser,
    delUser       : delUser,
    getPrivateData: getPrivateData,
    setPrivateData: setPrivateData,
    sanitizeInput : sanitizeInput,
};
