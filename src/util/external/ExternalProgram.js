/**
 * Generated On: 2015-7-18
 * @class ExternalProgram
 *
 * @description An interface to an external program. This abstract class defines which methods should be implemented by sub-classes.
 */

function ExternalProgram(proc) {

    proc = proc || {};

    var that = {};

    /**
     * @description executes a command to external program. This method is abstract and should be provided a
     *  defintition by a sub-class.
     *
     * @precondition validCallback : The next callback function should be a function that takes 3 arguments.
     *
     * @param cmd {String} - a string that is the command that should be executed.
     * @param stdin {String} - a string to be pushed into the standard input of the program.
     * @param next { Function } - function to call after the program has been executed.
     *
     */
    var exec = function (cmd, stdin, next) {
        throw 'AbstractMethodNotImplementedError';
    };

    /**
     * @description removes any characters that could be used for an injection attack on the external program.
     *  this function provides a default implementation that strips out common injection attack chars, more specific
     *  functionality should be provided by a specific sub-class
     *
     * @param s {String} the string to sanitize.
     *
     * return {String} the sanitized string.
     */
    var sanitizeInput = function (s) {

        if (!s) {

            throw new Error("ExternalProgram.sanitizeInput(input : String) requires a string input, input was: " + s);

        }

        s = s.replace(/;/gi, ""); //remove ;, which can be used to inject commandline
        s = s.replace(/\\'/gi, "\'"); //remove back slashes.

        return s;

    };

    proc.sanitizeInput = sanitizeInput;

    that.exec = exec;

    return that;

}


module.exports = {ExternalProgram: ExternalProgram};