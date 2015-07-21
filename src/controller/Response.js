/**
 * Generated On: 2015-7-17
 * @class Response
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

        if (obj.respond && obj.cookie) {
            proc.response.format({
                json: function () {
                    proc.response.json(obj)
                },
                html: function () {
                    proc.response.redirect(obj.respond + "?cookie=" + obj.cookie);
                }
            });
        } else {

            proc.response.json(obj);

        }

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

    var redirect = function (path) {

        path = path || '/auth/login';

        proc.response.redirect(path);

    };

    var sendBadRequest = function (message) {

        //HTTP status code for bad request is 400.
        proc.response.status(400);
        proc.response.json({message: message});

    };

    that.send           = send;
    that.show           = show;
    that.redirect       = redirect;
    that.sendBadRequest = sendBadRequest;

    return that;

}


module.exports = {Response: Response};