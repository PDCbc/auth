/**
 * Generated On: 2015-7-17
 * Class: Request
 */

function Request(request, proc) {

    var that = {};

    proc = proc || {};

    proc.request = request;


    /**
     */
    var getSourceIP = function () {
        //TODO: Implement Me 

    };


    /**
     */
    var getSourceMAC = function () {
        //TODO: Implement Me 

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

    that.getSourceIP  = getSourceIP;
    that.getSourceMAC = getSourceMAC;
    that.getQuery     = getQuery;
    that.getParams    = getParams;

    return that;

}


module.exports = {Request: Request};