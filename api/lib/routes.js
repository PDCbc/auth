'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');

var express = require('express'),
    auth    = require('./auth');

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
            var user = req.body.user,
                pass = req.body.pass,
                juri = req.body.juri,
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
                    res.format({
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
    userRouter.use(auth.hasRole('admin'));
    userRouter.route('/')
        .get(function (req, res) {
            auth.listUsers(function (err, juri) {
                if (err) { res.send(); logger.dir(err); }
                else     {
                    res.render('users', { juri: juri });
                }
            });
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                pass = req.body.password;
            auth.addUser(juri, user, pass, function (err) {
                if (err) { res.status(500).send(); logger.dir(err); }
                else     { res.redirect(from); }
            });
        })
        .delete(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.jurisdiction;
            auth.delUser(juri, user, function (err) {
                if (err) { res.status(500).send(); }
                else     { res.redirect(from); }
            });
        });

    var roleRouter = new express.Router();
    roleRouter.use(auth.hasRole('admin'));
    roleRouter.route('/')
        .get(function (req, res) {
            res.render('roles', {});
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.jurisdiction,
                role = req.body.role;
            auth.addRole(juri, user, role, function (err) {
                if (err) { res.status(500); }
                else     { res.status(200).redirect(from); }
            });
        })
        .delete(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.jurisdiction,
                role = req.body.role;
            auth.delRole(juri, user, role, function (err) {
                if (err) { res.status(500); }
                else     { res.status(200).redirect(from); }
            });
        });

    var verifyRouter = new express.Router();
    verifyRouter.post('/verify', function (req, res) {
        var bakedCookie = req.body.bakedCookie;
        auth.unbakeCookie(bakedCookie, function (err, unbaked) {
            if (err) { res.status(500); }
            else     { res.status(200).json(unbaked); }
        })
    });

    var mainRouter = data.httpd.main;
    mainRouter.use('/auth', authRouter);
    var controlRouter = data.httpd.control;
    controlRouter.use('/users', userRouter);
    controlRouter.use('/roles', roleRouter);
    controlRouter.use('/auth', authRouter);

    next(null);
}

// This task depends on `httpd` task.
module.exports = [ 'httpd', routes ];
