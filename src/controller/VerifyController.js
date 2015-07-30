/**
 * Generated On: 2015-7-17
 * @class VerifyController
 *
 */

var RouteController = require('./RouteController').RouteController;
var logger          = require("../util/logger/Logger").Logger("VerifyController");
var util            = require('util');
var VerifyAction    = require("./action/VerifyAction").VerifyAction;

function VerifyController(path, proc) {

    proc = proc || {};

    proc.path = path || '/';

    var that = RouteController(proc.path, proc);


    /**
     * @param req { Request }
     * @param res { Response }
     */
    var handlePost = function (req, res) {

        logger.info(req.getCookie());
        proc.verifyAction = VerifyAction(req.getCookie(), req);

        proc.verifyAction.doAction(function (err, result) {

            if (err) {

                return res.send(401, {error: err});

            } else {

                //result is expected to be a UserCookie object.
                return res.send(200, {

                    cookie: result.getCookieString(),
                    clinician: result.getUser().getClinicianId(),
                    clinic: result.getUser().getClinic(),
                    username : result.getUser().getUsername(),
                    federation : process.env.FEDERATION,
                    jurisdiction : result.getUser().getJurisdiction()

                });

            }

        });

    };

    var handleGet = function(req, res){

        return res.redirect("/auth/login");

    };

    proc.handlePost = handlePost;
    proc.handleGet = handleGet;

    return that;

}

module.exports = {VerifyController: VerifyController};