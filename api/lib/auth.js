'use strict';
var async = require('async'),
    _ = require('lodash'),
    fs = require('fs'),
    logger = require('./logger');

/**
 * Adds a user to DACS.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The username.
 * @param {String}   password     The user password.
 * @param {Function} next         The callback, signature (Error, Boolean).
 */
function addUser(jurisdiction, user, password, next) {
    var exec = require('child_process').exec,
        juri_opts = '-uj ' + jurisdiction,
        pass_opts = '-p ' + password,
        other_opts = '-a ' + user,
        command = ['dacspasswd', juri_opts, pass_opts, other_opts].join(' ');
    exec(command, function finish(err, stdout, stderr) {
        if (err !== null) {
            // Status code is not 0.
            next(err, false);
        } else {
            next(err, true);
        }
    });
}
/**
 * Removes a user from DACS.
 * @param {String}   jurisdiction The jurisdiction of the user.
 * @param {String}   user         The username.
 * @param {Function} next         The callback, signature (Error, Boolean).
 */
function delUser(jurisdiction, user, next) {
    var exec = require('child_process').exec,
        juri_opts = '-uj ' + jurisdiction,
        other_opts = '-d ' + user,
        command = ['dacspasswd', juri_opts, other_opts].join(' ');
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
}

function listUsers(next) {
    var exec = require('child_process').exec,
        fs = require('fs'),
        other_opts = '-l';
    async.waterfall([
        function readDirectory(cb) {
            fs.readdir(process.env.DACS + '/federations/' + process.env.FEDERATION, cb);
        },
        function filesToStats(files, cb) {
            files = files.map(function (v) {
                return process.env.DACS + '/federations/'  + process.env.FEDERATION + '/' + v;
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
            dirs = _.map(dirs, function (val) {
                return val.split('/').pop();
            });
            var pair = _.map(dirs, function (dir) {
                return [dir, ['dacspasswd', '-uj ' + dir, other_opts].join(' ')];
            });
            var users = {};
            async.each(pair, function (pair, callback) {
                exec(pair[1], function (err, out) {
                    // The last item in the `out` is empty.
                    var split = out.split('\n'); // This are the usernames.
                    split.pop(); // Gets the last `''` string.
                    var with_roles = async.map(split,
                        function (v, back) {
                            getRoles(v, function (err, roles) {
                                back(err, {name: v, roles: roles});
                            });
                        },
                        function (err, with_roles) {
                            users[pair[0]] = with_roles;
                            callback(err);
                        });
                });
            }, function (err) { cb(err, users); });
        }
    ], function (err, data) {
        // console.log(data);
        next(err, data);
    });
}

function setRoles(jurisdiction, user, roles, next) {
    readRoles(function (err, users) {
        users[user] = roles;
        writeRoles(users, next);
    });
}

// TODO: Unused.
// function addRole(jurisdiction, user, role, next) {
//     // Need to do some file manips.
//     // http://www.hoverbear.org/2014/11/17/first-look-at-dacs/#dacsroles
//     // TODO: Currently jurisdictions aren't handled really.
//     readRoles(function (err, users) {
//         users[user].push(role);
//         writeRoles(users, next);
//     });
// }

// TODO: Unused.
// function delRole(jurisdiction, user, role, next) {
//     // Need to do some file manips.
//     // http://www.hoverbear.org/2014/11/17/first-look-at-dacs/#dacsroles
//     // TODO: Currently jurisdictions aren't handled really.
//     readRoles(function (err, users) {
//         var index = users[user].indexOf(role);
//         users[user].split(index, 1);
//         writeRoles(users, next);
//     });
// }

function readRoles(next) {
    fs.readFile(process.env.ROLEFILE, {encoding: 'utf8'}, function (err, data) {
        if (!err && data) {
            var users = {};
            _.forIn(data.split('\n'), function (v) {
                console.log("READ: --" + v + "--");
                if (v.length === 0) {
                    console.log("SKIPPED");
                    return;
                }
                var split = v.split(':');
                var roles = split[1].split(',');
                users[split[0]] = roles;
            });
            next(null, users);
        } else {
            next(err, null);
        }
    });
}

function writeRoles(users, next) {
    var out = "";
    console.log(JSON.stringify(users, null, 2));
    _.forIn(users, function (v, k) {
        console.log("USER: --" + k + "-- ROLES --" + v + "--");
        out = out.concat(k + ':' + v.join(',') + '\n');
    });
    console.log("START");
    console.log(out);
    console.log("END");
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
    var exec = require('child_process').exec,
        module_opts = '-m passwd passwd required',
        vfs_opts = '-vfs "[passwds]dacs-kwv-fs:/etc/dacs/federations/' + process.env.FEDERATION + '/' + jurisdiction + '/passwd"',
        fed_opts = '-fn ' + process.env.FEDERATION + ' -fj ' + jurisdiction,
        login_opts = '-u ' + user + ' -p ' + pass,
        command = ['dacsauth -v', module_opts, vfs_opts, fed_opts, login_opts].join(' ');
    exec(command, function finish(err, stdout, stderr) {
        // `err` is not null if the status code is not 0.
        // This would mean login failed.
        next(err);
    });
}

/**
 * Bakes a cookie for the user and passes it along. This uses `dacscookie`.
 * @param {String}   user The username to bake the cookie for.
 * @param {String}   ip   The IP address the user is originating from.
 * @param {Function} next The callback, signature (Error, String).
 */
function bakeCookie(user, roles, ip, next) {
    // TODO: Can't pass user-agent (https://dacs.dss.ca/man/dacscookie.1.html)
    //       This is because we can't decrypt it.
    var exec = require('child_process').exec,
        fed_opts = "-u " + process.env.FEDERATION,
        ip_opts = '-ip ' + ip,
        role_opts = '-role ' + roles,
        name_opts = '-user ' + user,
        command = ['dacscookie', fed_opts, ip_opts, name_opts].join(' ');
    // Roles aren't always included. (Some users are role-less)
    // console.log(roles);
    if (roles) {
        command = command.concat(' ' + role_opts);
    }
    // console.log(command);
    exec(command, function pass(err, stdout, stderr) {
        return next(err, stdout);
    });
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
    var byLine = data.trim().split('\n');
    var user = {};
    _.each(byLine, function (line) {
        var split = line.split('='),
            key = split[0];
        // TODO: This isn't ideal! We need to clean this!
        var upTo = split[1].substring(1, split[1].length - 1);
        user[key] = upTo;
    });
    return user;
}

/**
* Unbakes a cookie and gives the unwrapped information. This uses `dacscookie`.
* @param {String}   cookie The cookie to unbake.
* @param {Function} next   The callback, signature (Error, String).
*/
function unbakeCookie(cookie, next) {
    if (cookie === undefined) { return next('Cookie was undefined.'); }
    // NOTE: This is much different than `exec`.
    var spawn = require('child_process').spawn,
        fed_opts = ['-u', process.env.FEDERATION, '-decrypt'],
        // TODO: Check IP.
        command = 'dacscookie';
    var dacscookie = spawn(command, _.flatten(fed_opts));
    dacscookie.stdin.write(cookie)
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
            next(String(stderr), null);
        } else {
            next(null, parse(String(stdout)));
        }
    });
}

/**
* Uses DACS' local module.
* Determines the user's roles.
* @param  {String}   user The username string.
* @param  {Function} next The callback, signature (Error, [String]).
*/
function getRoles(user, next) {
    var exec = require('child_process').exec,
        module_opts = '-r roles',
        vfs_opts = '-vfs "[roles]dacs-kwv-fs:' + process.env.ROLEFILE + '"',
        login_opts = '-u ' + user,
        command = ['dacsauth', module_opts, vfs_opts, login_opts].join(' ');
    exec(command, function parse(err, stdout, stderr) {
        if (err) {
            console.log(stdout);
            // The status code is not 0.
            next(err, stdout.trim().split(','));
        } else {
            console.log("GETROLES --" + stdout.trim() + "--");
            next(null, stdout.trim().split(','));
        }
    });
}

/**
 * Checks to see if a user has a role.
 * @param  {String}    role The role to check.
 * @return {Function}  next A middleware, signature (Error, Boolean).
 */
function hasRole(role) {
    return function roleCheck(req, res, next) {
        unbakeCookie(req.session.baked, function (err, data) {
            if (!err && data) {
                // console.log("Unbaked: " + require('util').inspect(data));
                getRoles(data.username, function check(err, roles) {
                    if (roles.indexOf(role) == -1) {
                        logger.error(err || 'Role ' + role + ' not found.');
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
}

/**
 * Exported functions.
 */
module.exports = {
    checkDetails: checkDetails,
    getRoles:     getRoles,
    hasRole:      hasRole,
    setRoles:     setRoles,
    bakeCookie:   bakeCookie,
    unbakeCookie: unbakeCookie,
    listUsers:    listUsers,
    addUser:      addUser,
    delUser:      delUser,
};
