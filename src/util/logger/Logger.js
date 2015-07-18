/**
 * Generated On: 2015-7-17
 * Class: Logger
 */

var colors = require('cli-color');

function Logger(path, proc) {

    proc = proc || {};

    var that = {};

    proc.path = path;

    var prepareOutput = function (level, s) {

        return "[" + level + "] " + proc.path + " : " + s;

    };

    /**
     * @param s {String}
     */
    var info = function (s) {

        console.log(colors.white(proc.prepareOutput("INFO", s)));
    };


    /**
     * @param s {String}
     */
    var warn = function (s) {
        console.log(colors.yellow(proc.prepareOutput("WARNING", s)));
    };


    /**
     * @param s {String}
     */
    var error = function (s) {
        console.log(colors.red(proc.prepareOutput("ERROR", s)));
    };


    /**
     * @param s {String}
     */
    var success = function (s) {
        console.log(colors.green(proc.prepareOutput("SUCCESS", s)));
    };

    proc.prepareOutput = prepareOutput;

    that.info    = info;
    that.warn    = warn;
    that.error   = error;
    that.success = success;

    return that;

}

module.exports = {Logger: Logger};