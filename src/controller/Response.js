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

        //TODO: Implement Me 

    };

    that.send = send;
    that.show = show;

    return that;

}


module.exports = {Response: Response};