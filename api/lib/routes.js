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
                from = req.header('Referer') || '/';
            async.parallel([
                _.partial(auth.checkDetails, juri, user, pass),
                _.partial(auth.getRoles, user)
            ], function complete(err, results) {
                var valid = results[0];
                var data = {
                    jurisdiction: juri,
                    user: user,
                    roles: results[1],
                    error: err || null
                    // TODO: Add some sort of token.
                };
                if (err || !valid) {
                    // Clients may not necessarily want HTML.
                    res.format({
                        json: function () {
                            // Send data.
                            res.status(401).json(data);
                        },
                        html: function () {
                            // Send back where they came from.
                            res.status(401).render('login', data);
                        }
                    });
                } else {
                    res.format({
                        json: function () {
                            res.status(200).json(data);
                        },
                        html: function () {
                            res.status(200).redirect(from);
                        }
                    });
                }
            });
            auth.checkDetails(juri, user, pass, function (err, valid) {


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
