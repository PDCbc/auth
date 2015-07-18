/**
 * Generated On: 2015-7-17
 * Class: RouteController
 *
 * An abstract object that defines an interface for other route controller types.
 *
 * This class implements a get, post, and delete functions but passes the functionality
 * off to concrete RouteController objects.
 */

var Response = require('./Response').Response;

var Request = require('./Request').Request;

function RouteController(path, proc) {

    var that = {};

    proc = proc || {};

    proc.path = path || "/";

    /**
     * @documentation Services a GET request. This method repackages the express.Request and express.Reponse objects
     * and calls the object's handleGet(Request, Response) method. The handleGet(...) method is responsible
     * for responding to the request.
     *
     * @param req { express.Request } - Express Request object.
     * @param res { express.Response } - Express Response object.
     */
    var get = function (req, res) {

        proc.handleGet(Request(req), Response(res));

    };

    /**
     * @documentation Services a POST request. This method repackages the express.Request and express.Response objects and
     * calls the object's handlePost(Request, Response) method. The handlePost(...) method is responsible
     * for responding to the request.
     *
     * @param req { express.Request }
     * @param res { express.Response }
     */
    var post = function (req, res) {

        proc.handlePost(Request(req), Response(res));

    };

    /**
     * @documentation: Gets the path the controller is meant to service for the API.
     *
     * @return  {String}
     */
    var getPath = function () {

        return proc.path;

    };

    /**
     * @param req {Request}
     * @param res {Response}
     */
    var handleGet = function (req, res) {

        console.log("RouterController.handleGet()");
        console.log(proc.handleGet);

        throw 'AbstractMethodNotImplementedError';

    };

    /**
     * @param req {Request}
     * @param res {Response}
     */
    var handlePost = function (req, res) {

        throw 'AbstractMethodNotImplementedError';

    };

    /**
     * @param req {Request}
     * @param res {Response}
     */
    var handleDelete = function (req, res) {
        throw 'AbstractMethodNotImplementedError';

    };

    that.get          = get;
    that.post         = post;
    that.getPath      = getPath;
    proc.handleGet    = handleGet;
    proc.handlePost   = handlePost;
    proc.handleDelete = handleDelete;

    return that;

}


module.exports = {RouteController: RouteController};