'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');

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
        if (err !== null) {
            // The status code is not 0.
            next(err, false);
        } else {
            next(null, true);
        }
    });
}

/**
 * Bakes a cookie for the user and passes it along. This uses `dacscookie`.
 * @param {String}   user The username to bake the cookie for.
 * @param {String}   ip   The IP address the user is originating from.
 * @param {Function} next The callback, signature (Error, String).
 */
function bakeCookie(user, ip, next) {
    var exec = require('child_process').exec,
        fed_opts = "-u " + process.env.FEDERATION,
        name_opts = '-user ' + user,
        ip_opts = '-ip ' + ip,
        command = ['dacscookie', fed_opts, ip_opts, name_opts].join(' ');
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
