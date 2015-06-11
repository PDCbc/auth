'use strict';

var async           = require('async');
var _               = require('lodash');
var logger          = require('./logger');
var express         = require('express');
var methodOverride  = require('method-override');
var util            = require('util');
var auth            = require('./auth');
    

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

        }).post(function (req, res) {

            try{

                if( !req || !req.body || !res ){

                    logger.warn("/auth/login received request with bad format, returning 400 error.");
                    res.status(400); 
                    res.json({ cookie : null, message : "Bad request format."})
                    return; 

                }


                var user = req.body.user,
                    pass = req.body.pass,
                    juri = req.body.juri,
                    respond = req.body.respond,
                    ip   = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                if (!user || !pass || !juri || !respond || !ip) {

                    logger.warn("/auth/login received request with bad format, returning 400 error.")
                    res.status(400); 
                    res.json({ cookie : null, message : "Bad request format."})
                    return; 

                }
        
                //if we get to here we know that we have a well formed request object.

                async.auto(

                    {

                        check: function (cb) {
                            auth.checkDetails(juri, user, pass, cb);
                        },

                        roles: ['check', _.partial(auth.getRoles, user)],

                        cookie: ['check', 'roles', function (cb, data) {

                            auth.bakeCookie(user, data.roles, ip, cb);

                        }],

                    }, function complete(err, results) {

                        try{

                            // Something failed.
                            if ( err ) {

                                switch(err){

                                    case 401: //failed login
                                        res.status(401);
                                        res.format({

                                            json: function () {

                                                //send back a null cookie
                                                logger.warn("/auth/login received invalid credentials provided, failing login. "); 
                                                res.json( { cookie : null, message : "Invalid credentials provided, login failed."} ); 
                                                return; 

                                            },

                                            html: function () {

                                                // Send back where they came from.
                                                res.redirect('/auth/login?message="Invalid credentials."');
                                                return;

                                            }
                                            
                                        });
                                        break; 

                                    case 400: //invalid data format
                                        res.status(400);
                                        res.format({

                                            json: function () {

                                                //send back a null cookie
                                                logger.warn("/auth/login received malformed input, login failed."); 
                                                res.json( { cookie : null, message : "Malformed input to auth, login failed."} ); 
                                                return; 

                                            },

                                            html: function () {

                                                // Send back where they came from.
                                                res.redirect('/auth/login?message="Invalid credentials."');
                                                return;

                                            }
                                            
                                        });
                                        break; 

                                    case 500:
                                        res.status(500);
                                        res.format({

                                            json: function () {

                                                //send back a null cookie
                                                logger.warn("/auth/login recieved an error, failing to login"); 
                                                res.json( { cookie : null, message : "Server caused an error during authentication, check logs for details."} ); 
                                                return; 

                                            },

                                            html: function () {

                                                // Send back where they came from.
                                                res.redirect('/auth/login?message="Invalid credentials."');
                                                return;

                                            }
                                            
                                        });
                                        break; 
                                    default:

                                        res.status(500);
                                        res.format({

                                            json: function () {

                                                //send back a null cookie
                                                logger.warn("/auth/login recieved an error, failing to login, error was: "+ util.inspect(err)); 
                                                res.json( { cookie : null, message : "Unknown error during login, check logs for details."} ); 
                                                return; 

                                            },

                                            html: function () {

                                                // Send back where they came from.
                                                res.redirect('/auth/login?message="Invalid credentials."');
                                                return;

                                            }
                                            
                                        });
                                        break;

                                }
                                return;

                            // All is fine.
                            } else {

                                res.status(200);
                                res.format({

                                    json: function () {

                                        //a successful authentication call was made, send back the cookie.
                                        res.json( { cookie : results.cookie, message : "Authentication was a success!"} );

                                    },

                                    html: function () {

                                        req.session.baked = results.cookie;
                                        res.redirect(respond + '?cookie=' + results.cookie);

                                    }

                                });

                            }

                        }catch(e){


                            logger.error("/login caught and exception: "+ util.inspect(e, false, null));
                            res.status(500); 
                            res.json({

                                message : "An exception was detected, failed to verify."

                            });

                        }

                    }

                );

            }catch(e){

                logger.error("/login caught and exception: "+ util.inspect(e, false, null));
                res.status(500); 
                res.json({

                    data : null,
                    message : "An exception was detected, failed to verify."

                });

            }

        }
    );

    var verifyRouter = new express.Router();

    verifyRouter.post('/', function (req, res) {

        var bakedCookie = req.body.bakedCookie;

        try {

            auth.unbakeCookie(bakedCookie, function (err, unbaked) {

                try{

                    if ( err ){

                        logger.error(err);

                        switch( err ){

                            case 401:
                                res.status(401); 
                                res.json({

                                    data : null,
                                    message : "Invalid or expired credentials, failed to verify."

                                });

                                break;

                            case 400:

                                res.status(400); 
                                res.json({

                                    data : null,
                                    message : "Malformed request or cookie, failed to verify."

                                });
                                break; 

                            case 500:

                                res.status(500); 
                                res.json({

                                    data : null,
                                    message : "An error occurred, failed to verify."

                                });

                                break;

                            default:
                                logger.error("verifyRouter(/) received an unknown error from auth.unbakeCookie(): "+ err);
                                res.status(500); 
                                res.json({

                                    data : null,
                                    message : "An error occurred, failed to verify."

                                });
                                break;

                        }

                    } else { 

                        res.status(200)
                        res.json({

                            data : unbaked, 
                            message : 'successful authentication.'

                        }); 

                    }

                }catch(e){

                    logger.error("routes.verifyRouter '/' caused exception: "+ e ); 
                    res.status(500); 
                    res.json({

                        data : null,
                        message : "An exception was detected, failed to verify."

                    });

                }

            });

        }catch( e ){

            logger.error("routes.verifyRouter '/' caused exception: "+ e ); 
            res.status(500); 
            res.json({

                data : null,
                message : "An exception was detected, failed to verify."

            })

        }

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
