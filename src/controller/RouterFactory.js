/**
 * Generated On: 2015-7-17
 * @class RouterFactory
 *
 * This class (object) is a factory to create express.Router objects from RouteContoller objects.
 */

var express                = require('express');
var logger                 = require('../util/logger/Logger').Logger('RouterFactory');
var InvalidControllerError = require("../util/error/InvalidControllerError").InvalidControllerError;

function RouterFactory(proc) {

    var that = {};

    proc = proc || {};

    /**
     * Generates a new express.Router that utilizes the controller passed in.
     *
     * @param controller { AuthController } - The controller to generate the router from.
     *
     * @return {express.Router} - The newly created router.
     */
    var createRouter = function (controller) {

        if (!controller.get) {

            throw new InvalidControllerError("Controller " + controller + " does not have the required get() function, failed to create express.Router");

        } else if (!controller.post) {

            throw new InvalidControllerError("Controller " + controller + " does not have the required post() function, failed to create express.Router");

        } else if (!controller.getPath) {

            throw new InvalidControllerError("Controller " + controller + " does not have the required getPath() function, failed to create express.Router");

        }

        var expRouter = new express.Router();

        //bind the path and functions
        expRouter.route(controller.getPath())
            .get(controller.get)
            .post(controller.post);

        return expRouter;

    };

    that.createRouter = createRouter;

    return that;

}


module.exports = {RouterFactory: RouterFactory};