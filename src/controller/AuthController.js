/**
 * Generated On: 2015-7-17
 * Class: AuthController
 * Description: Allows users to authenticate and obtain cookies.
 */

var util = require('util');

var RouteController = require('./RouteController').RouteController;
var NotImplementedError = require("../util/error/NotImplementedError").NotImplementedError;

function AuthController(path, proc) {

    proc = proc || {};

    proc.path = path || "/login";

    var that = RouteController(proc.path, proc);

    /**
     * @param req {Request}
     * @param res {Response}
     */
    var handlePost = function (req, res) {

        res.send(200, "some response");

    };

    /**
     * @param req { Request }
     * @param res { Response }
     */
    var handleGet = function (req, res) {

        res.show("login");

    };

    proc.handlePost = handlePost;
    proc.handleGet  = handleGet;

    return that;

}

module.exports = {AuthController: AuthController};