/**
 * Generated On: 2015-7-17
 * Class: Response
 */

function Response(response, proc) {
    var that = {};

    proc = proc || {};

    proc.response = response;

    /**
     * Sends the obj Object as a json object to the client.
     *
     * @param obj {Object}
     */
    var send = function (status, obj) {

        proc.response.status(status);
        proc.response.json(obj);

    };


    /**
     * Shows the view and passes it data in obj.
     *
     * @param view {String}
     * @param obj {Object}
     */
    var show = function (view, obj) {

        if (!view) {

            throw new Error("Cannot render view: " + view);

        }

        obj = obj || {};

        proc.response.render(view, obj);

    };

    var redirect  = function (path) {

        proc.response.redirect("/auth/login");

    };

    var sendBadRequest = function (message) {

        //HTTP status code for bad request is 400.
        proc.response.status(400);
        proc.response.json({message: message});

    };

    that.send           = send;
    that.show           = show;
    that.redirect = redirect;
    that.sendBadRequest = sendBadRequest;

    return that;

}


module.exports = {Response: Response};