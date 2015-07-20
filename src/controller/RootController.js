/**
 * Generated On: 2015-7-17
 * Class: RootController
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

        res.redirect("/auth/login");

    };

    proc.handleGet = handleGet;

    return that;

}

module.exports = {RootController: RootController};