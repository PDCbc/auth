/**
 * Generated On: 2015-7-17
 * @class Request
 */

function Request(request, proc) {

    proc = proc || {};

    var that = {};

    proc.request = request || null;


    /**
     */
    var getSourceIP = function () {

        return proc.request.headers['x-forwarded-for'] || proc.request.connection.remoteAddress;

    };

    /**
     */
    var getQuery = function () {
        //TODO: Implement Me 

    };


    /**
     */
    var getParams = function () {
        //TODO: Implement Me 

    };

    /**
     * Returns the request's body object.
     *
     * @returns { Object }
     */
    var getBody = function () {

        return proc.request.body;

    };

    /**
     *
     * @returns {String}
     */
    var getCookie = function () {

        if (proc.request && proc.request.body) {

            return proc.request.body.cookie;

        }

    };

    /**
     * @description determines if the Request object is well formed, specifically that it has an internal request.
     *
     * @returns {boolean} returns true if the Request is well formed, false otherwise.
     */
    var isWellFormed = function () {

        if (!proc.request) {

            return false;

        } else {

            return true;

        }
    };

    var getRespond = function () {
        var b = that.getBody();

        if (b && b.respond) {

            return b.respond;

        } else {
            return null;
        }
    };

    var setCookie = function (cookie) {

        if (proc.request && proc.request.session) {
            proc.request.session.baked = cookie;
        }

    };

    var getCookie = function(){

        if(proc.request && (proc.request.session || proc.request.body)){

            return proc.request.body.bakedCookie || proc.request.session.baked;

        }else{

            return null;

        }

    };

    var getSession = function () {
        if (proc.request && proc.request.session) {

            return proc.request.session;

        } else {

            return null;

        }
    };

    that.getSourceIP  = getSourceIP;
    that.getQuery     = getQuery;
    that.getParams    = getParams;
    that.getBody      = getBody;
    that.isWellFormed = isWellFormed;
    that.getCookie    = getCookie;
    that.getRespond   = getRespond;
    that.setCookie    = setCookie;
    that.getCookie    = getCookie;
    that.getSession   = getSession;

    return that;

}


module.exports = {Request: Request};