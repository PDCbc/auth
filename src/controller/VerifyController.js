/**
 * Generated On: 2015-7-17
 * @class VerifyController
 *
 * Handlesw
 */

var RouteController = require('./RouteController').RouteController;
var logger          = require("../util/logger/Logger").Logger("VerifyController");
var util            = require('util');
var VerifyAction = require("./action/VerifyAction").VerifyAction;

function VerifyController(path, proc) {

    proc = proc || {};

    proc.path = path || '/';

    var that = RouteController(proc.path, proc);


    /**
     * @param req { Request }
     * @param res { Response }
     */
    var handlePost = function (req, res) {

        proc.verifyAction = VerifyAction(req.getCookie(), req);


        proc.verifyAction.doAction(function(err, result){

            //MAKE SURE WE CHECK THE RESULT IP.

            return res.send(200, {error : err, result : result});

        });

    };

    proc.handlePost = handlePost;

    return that;

}

module.exports = {VerifyController: VerifyController};