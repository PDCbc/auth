'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');

var express = require('express'),
    methodOverride = require('method-override'),
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
            res.render('login', {
                respond: "/"
            });
        })
        .post(function (req, res) {
            var user = req.body.user,
                pass = req.body.pass,
                juri = req.body.juri,
                respond = req.body.respond,
                ip   = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // console.log(req.body);
            // console.log(ip);
            if (!user || !pass || !juri || !respond || !ip) {
                logger.log("Attempted to login without specifying all the details.");
                return res.status(400).json({failure: true});
            }
            async.auto({
                check: function (cb) {
                    auth.checkDetails(juri, user, pass, cb);
                },
                roles: ['check', _.partial(auth.getRoles, user)],
                cookie: ['check', 'roles', function (cb, data) {
                    auth.bakeCookie(user, data.roles, ip, cb);
                }],
            }, function complete(err, results) {
                // console.log(results);
                // Something failed.
                if (err) {
                    logger.error(err);
                    // Clients may not necessarily want HTML.
                    res.status(401).format({
                        json: function () {
                            // Send data.
                            res.json({failure: true});
                        },
                        html: function () {
                            // Send back where they came from.
                            res.redirect('/auth/login?message="Invalid credentials."');
                        }
                    });
                // All is fine.
                } else {
                    res.format({
                        json: function () {
                            res.json(results.cookie);
                        },
                        html: function () {
                            req.session.baked = results.cookie;
                            res.redirect(respond + '?cookie=' + results.cookie);
                        }
                    });
                }
            });
        });

    var verifyRouter = new express.Router();
    verifyRouter.post('/', function (req, res) {
        var bakedCookie = req.body.bakedCookie;
        // console.log("BAKED COOKIE IS " + require('util').inspect(bakedCookie));
        auth.unbakeCookie(bakedCookie, function (err, unbaked) {
            if (err) { console.log("Error"); res.status(500).send(); }
            else     { res.status(200).json(unbaked); }
        });
    });

    var userRouter = new express.Router();
    userRouter.use(auth.hasRole('admin'));
    userRouter.use(methodOverride('_method'));
    userRouter.route('/')
        .get(function (req, res) {
            auth.listUsers(function (err, juri) {
                if (err) { res.status(500).send(); logger.dir(err); }
                else     {
                    res.render('users', { juri: juri });
                }
            });
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                pass = req.body.pass;
            auth.addUser(juri, user, pass, function (err) {
                if (err) { res.status(500).send(); logger.dir(err); }
                else     { res.redirect(from); }
            });
        })
        .delete(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri;
            auth.delUser(juri, user, function (err) {
                if (err) { res.status(500).send(); logger.dir(err);}
                else     { res.redirect(from); }
            });
        });
    userRouter.route('/data')
        .get(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.query.user,
                juri = req.query.juri;
            console.log(req.body);
            auth.getPrivateData(juri, user, function (err, data) {
                if (err) { res.status(500).send(); logger.dir(err); }
                else     { res.json(data); }
            });
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                data = req.body.data;
            console.log(req.body);
            auth.setPrivateData(juri, user, data, function (err) {
                if (err) { res.status(500).send(); logger.dir(err); }
                else     { res.redirect(from); }
            });
        });
        // .delete(function (req, res) {
        //
        // });

    var roleRouter = new express.Router();
    roleRouter.use(auth.hasRole('admin'));
    roleRouter.use(methodOverride('_method'));
    roleRouter.route('/')
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                roles = req.body.roles.split(','); // TODO: Security Check?
            auth.setRoles(juri, user, roles, function (err) {
                if (err) { res.status(500); }
                else     { res.status(200).redirect(from); }
            });
        });
        // .delete(function (req, res) {
        //     var from = req.header('Referer') || '/',
        //         user = req.body.user,
        //         juri = req.body.juri,
        //         role = req.body.role;
        //     auth.delRole(juri, user, role, function (err) {
        //         if (err) { res.status(500); }
        //         else     { res.status(200).redirect(from); }
        //     });
        // });
        //

    var mainRouter = data.httpd.main;
    mainRouter.use('/auth', authRouter);
    var controlRouter = data.httpd.control;
    controlRouter.use('/users', userRouter);
    controlRouter.use('/roles', roleRouter);
    controlRouter.use('/auth', authRouter);
    controlRouter.use('/verify', verifyRouter);

    next(null);
}

// This task depends on `httpd` task.
module.exports = [ 'httpd', routes ];
