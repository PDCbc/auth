'use strict';

var async          = require('async');
var _              = require('lodash');
var logger         = require('./logger');
var express        = require('express');
var methodOverride = require('method-override');
var util           = require('util');
var auth           = require('./auth');

var RouterFactory  = require("../controller/RouterFactory").RouterFactory;
var AuthController = require("../controller/AuthController").AuthController;


/**
 * Sets up the standard routes for the application. Check the express documentation on routers.
 * @param {Function} next The async callback. Signature (error, result)
 * @param {Object} data Contains results of the `models` and `httpd` task.
 */
function routes(next, data) {

    var mainRouter    = data.httpd.main;
    var controlRouter = data.httpd.control;

    var factory = RouterFactory();

    var authController = AuthController("/login");

    var authRouter = factory.createRouter(authController);

    mainRouter.use('/auth', authRouter);


    var userRouter = new express.Router();
    userRouter.use(auth.hasRole('admin'));
    userRouter.use(methodOverride('_method'));
    userRouter.route('/')
        .get(function (req, res) {

            console.log("/users");

            auth.listUsers(function (err, juri) {
                if (err) {
                    res.status(500).send();
                    logger.dir(err);
                }
                else {
                    res.render('users', {juri: juri});
                }
            });
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                pass = req.body.pass;
            auth.addUser(juri, user, pass, function (err) {
                if (err) {
                    res.status(500).send();
                    logger.dir(err);
                }
                else {
                    res.redirect(from);
                }
            });
        })
        .delete(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri;
            auth.delUser(juri, user, function (err) {
                if (err) {
                    res.status(500).send();
                    logger.dir(err);
                }
                else {
                    res.redirect(from);
                }
            });
        });
    userRouter.route('/data')
        .get(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.query.user,
                juri = req.query.juri;
            console.log(req.body);
            auth.getPrivateData(juri, user, function (err, data) {
                if (err) {
                    res.status(500).send();
                    logger.dir(err);
                }
                else {
                    res.json(data);
                }
            });
        })
        .post(function (req, res) {
            var from = req.header('Referer') || '/',
                user = req.body.user,
                juri = req.body.juri,
                data = req.body.data;
            console.log(req.body);
            auth.setPrivateData(juri, user, data, function (err) {
                if (err) {
                    res.status(500).send();
                    logger.dir(err);
                }
                else {
                    res.redirect(from);
                }
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
                if (err) {
                    res.status(500);
                }
                else {
                    res.status(200).redirect(from);
                }
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

    controlRouter.use('/users', userRouter);
    controlRouter.use('/roles', roleRouter);
    controlRouter.use('/auth', authRouter);
    //controlRouter.use('/verify', verifyRouter);

    next(null);
}

// This task depends on `httpd` task.
module.exports = ['httpd', routes];
