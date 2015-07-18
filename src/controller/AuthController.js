/**
 * Generated On: 2015-7-17
 * Class: AuthController
 * Description: Allows users to authenticate and obtain cookies.
 */

var util = require('util');

var RouteController = require('./RouteController').RouteController;
var LoginAction     = require("./action/LoginAction").LoginAction;
var logger          = require("../util/logger/Logger").Logger("AuthController");

function AuthController(path, proc) {

    proc = proc || {};

    proc.path = path || "/login";

    var that = RouteController(proc.path, proc);

    proc.loginAction = null;

    /**
     * @documentation Internal method to handle POST requests. Called by RouteController.post() method.
     *
     * @param req {Request}
     * @param res {Response}
     */
    var handlePost = function (req, res) {

        //integrity check...
        if (!req || !res) {

            throw new Error("AuthController.handlePost(req, res) received invalid inputs.");

        }

        var body = req.getBody();

        if (!body || !body.user || !body.pass || !body.juri) {

            res.sendBadRequest("POST to /auth/login requires the body field have form: { user : String, pass : String, juri : String}");

        }

        proc.loginAction = LoginAction(body.user, body.pass, body.juri, req);

        proc.loginAction.doAction(function (err, result) {

            res.send(200, result);

        });

    };

    /**
     * @documentation Internal method to handle GET requests, called by RouteController.get()
     *
     * @param req { Request }
     * @param res { Response }
     */
    var handleGet = function (req, res) {

        //we just redirect the to the login screen.
        res.show("login");

    };

    proc.handlePost = handlePost;
    proc.handleGet  = handleGet;

    return that;

}

module.exports = {AuthController: AuthController};
