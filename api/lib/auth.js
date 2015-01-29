'use strict';
var async = require('async'),
    _ = require('lodash'),
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
        other_opts = '-a' + user,
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
        fed_opts = '-fn ' + process.env.FEDERATION + '-fj ' + jurisdiction,
        login_opts = '-u ' + user + ' -p ' + pass,
        command = ['dacsauth', module_opts, vfs_opts, login_opts].join(' ');
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
        command = ['dacscookie', fed_opts, ip_opts, role_opts, name_opts].join(' ');
    exec(command, function pass(err, stdout, stderr) {
        return next(err, stdout);
    });
}

/**
* Unbakes a cookie and gives the unwrapped information. This uses `dacscookie`.
* @param {String}   cookie The cookie to unbake.
* @param {Function} next   The callback, signature (Error, String).
*/
function unbakeCookie(cookie, next) {
    // NOTE: This is much different than `exec`.
    var spawn = require('child_process').spawn,
        fed_opts = ['-u ', process.env.FEDERATION],
        // TODO: Check IP.
        command = 'dacscookie';
    var dacscookie = spawn(command, _.flatten(fed_opts));
    dacscookie.stdin.write(cookie);
    dacscookie.stdout('data', function respond(data) {
        next(null, data);
    });
    dacscookie.stderr('data', function respond(data) {
        next(data, null);
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
        vfs_opts = '-vfs "[roles]dacs-kwv-fs:/etc/dacs/federations/roles"',
        login_opts = '-u ' + user,
        command = ['dacsauth', module_opts, vfs_opts, login_opts].join(' ');
    exec(command, function parse(err, stdout, stderr) {
        if (err) {
            // The status code is not 0.
            next(err, stdout.trim().split(','));
        } else {
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
    return function (req, res, next) {
        getRoles(req.session.user, function check(err, roles) {
            if (roles.indexOf(role) == -1) {
                next(err, false);
            } else {
                next(err, true);
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
    bakeCookie:   bakeCookie,
    unbakeCookie: unbakeCookie
};
