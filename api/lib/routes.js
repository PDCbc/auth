'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');
var express = require('express'),
    auth = require('auth');

/**
* Sets up the standard routes for the application. Check the express documentation on routers.
* @param {Function} next The async callback. Signature (error, result)
* @param {Object} data Contains results of the `models` and `httpd` task.
*/
function routes(next, data) {
    var authRouter = new express.Router();
    authRouter.route('/login')
        .get(function (req, res) {
            res.render('login', {});
        })
        .post(function (req, res) {
            var user = req.query.user,
                pass = req.query.pass,
                juri = req.query.jurisdiction,
                from = req.header('Referer') || '/',
                ip   = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            async.auto({
                check: _.partial(auth.checkDetails, juri, user, pass),
                roles: ['check', _.partial(auth.getRoles, user)],
                cookie: ['check', 'roles', function (cb, data) {
                    auth.bakeCookie(user, data.roles, ip, cb);
                }],
            }, function complete(err, results) {
                // Something failed.
                if (err) {
                    // Clients may not necessarily want HTML.
                    res.status(401).format({
                        json: function () {
                            // Send data.
                            res.json({failure: true});
                        },
                        html: function () {
                            // Send back where they came from.
                            res.render('login', data);
                        }
                    });
                // All is fine.
                } else {
                    res.status(200).format({
                        json: function () {
                            res.json(data.cookie);
                        },
                        html: function () {
                            req.signedCookie.auth = data.cookie;
                            // TODO: Is this enough? Should we include it
                            // some other way?
                            res.redirect(from);
                        }
                    });
                }
            });
        });
    // TODO: Add an auth check route.


    var userRouter = new express.Router();
    userRouter.get('/',
        auth.hasRole('admin'),
        function (req, res) {

        });
    userRouter.post('/add',
        auth.hasRole('admin'),
        function (req, res) {
            var user = req.query.user,
                role = req.query.role;
        });

    userRouter.post('/remove',
        auth.hasRole('admin'),
        function (req, res) {
            var user = req.query.user,
                role = req.query.role;
        });

    var roleRouter = new express.Router();
    roleRouter.route('/',
        auth.hasRole('admin'),
        function (req, res) {

        });
    roleRouter.post('/add',
        auth.hasRole('admin'),
        function (req, res) {
            var user = req.query.user,
            role = req.query.role;
        });

    roleRouter.post('/remove',
        auth.hasRole('admin'),
        function (req, res) {
            var user = req.query.user,
            role = req.query.role;
        });
}

// This task depends on `httpd` task.
module.exports = [ 'httpd', routes ];
