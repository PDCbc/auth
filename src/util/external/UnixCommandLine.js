/**
 * Generated On: 2015-7-18
 * Class: UnixCommandLine
 */

var ExternalProgram = require('ExternalProgram');

function UnixCommandLine(proc) {
    var that = ExternalProgram();


    proc = proc || {};


    /**
     * @param cmd {String}
     * @param next {[object Object]}
     */
    var exec = function (cmd, next) {
        //TODO: Implement Me 

    };


    /**
     */
    var UnixCommandLine = function () {
        //TODO: Implement Me 

    };

    that.exec            = exec;
    that.UnixCommandLine = UnixCommandLine;

    return that;

}


module.exports = {UnixCommandLine: UnixCommandLine};