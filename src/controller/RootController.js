/**
 * Generated On: 2015-7-17
 * @class RootController
 *
 * Handlesw
 */

var RouteController = require('./RouteController').RouteController;
var logger          = require("../util/logger/Logger").Logger("RootController");

function RootController(path, proc) {

    proc = proc || {};

    proc.path = path || '/';

    var that = RouteController(proc.path, proc);

    /**
     * @param req { Request }
     * @param res { Response }
     */
    var handleGet = function (req, res) {

        //if they have a session, they have logged in.

        if(req.getSession() && req.getCookie()){

            res.redirect("/users");

        }else{

            res.redirect("/auth/login");

        }

    };

    proc.handleGet = handleGet;

    return that;

}

module.exports = {RootController: RootController};