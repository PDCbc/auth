/**
 * Generated On: 2015-7-17
 * Class: VerifyController
 *
 * Handlesw
 */

var RouteController = require('./RouteController').RouteController;
var logger          = require("../util/logger/Logger").Logger("VerifyController");

function VerifyController(path, proc) {

    proc = proc || {};

    proc.path = path || '/verify';

    var that = RouteController(proc.path, proc);

    /**
     * @param req { Request }
     * @param res { Response }
     */
    var handlePost = function (req, res) {

        res.send(200, "OK");

    };

    proc.handlePost = handlePost;

    return that;

}

module.exports = {VerifyController: VerifyController};