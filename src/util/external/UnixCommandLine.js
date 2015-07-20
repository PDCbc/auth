/**
 * Generated On: 2015-7-18
 * Class: UnixCommandLine
 *
 * Description: An ExternalProgram interface to the the unix command line. Executes commands using node's child_process library.
 *  Utilizes NodeJS' child_process library: https://nodejs.org/api/child_process.html
 */

var ExternalProgram      = require('./ExternalProgram').ExternalProgram;
var CallbackInvalidError = require("../error/CallbackInvalidError").CallbackInvalidError;
var error = require("../Codes.js");
var cp                   = require("child_process");
var logger               = require("../logger/Logger").Logger("UnixCommandLine");

function UnixCommandLine(proc) {

    proc = proc || {};

    var that = ExternalProgram(proc);

    /**
     * @documentation executes a command to the unix commandline. If the stdin parameter is non-null the
     * contents of the string will be written into the process' standard input.
     *
     * @precondition validCommand : the cmd is a non-empty string.
     * @precondition validCallback : the next callback function is a function with three arguments.
     * @precondition sanitizeInputIsSet : the proc.sanitizeInput(String) function is set and takes 1 argument.
     *
     * @param cmd {String} the command to execute
     * @param stdin {String} a string to pass to stdin, if there is no need to write the stdin, this should be null.
     * @param next { Function } function to pass the results of the execution to, has signature next(err, stdout, stderr)
     */
    var exec = function (cmd, stdin, next) {

        stdin = stdin || null;

        if (!proc.execPreconditions(cmd, stdin, next)) {

            return next(error.ERR_FAILED_PRECONDITION, null, null);

        }

        //rely on the ExternalProgram.sanitizeInput() function.
        cmd = proc.sanitizeInput(cmd);

        proc._exec(cmd, stdin, next);

    };

    /**
     * @documentation internal execute function. Exists to filter based on type of execution, whether it uses stdin or not.
     *
     * @param cmd {String} The command to execute
     * @param stdin {String} If this is non-null this input will be written to the standard in of the program
     * @param next {Function} Call this function when you are done. Must take have three arguments.
     */
    var _exec = function (cmd, stdin, next) {

        //if we have to write to stdin we need to use a different approach
        //filter for this and call the different function.
        if (stdin && stdin !== "") {

            return proc.execStdin(cmd, stdin, next);

        } else {

            return proc.execOneLine(cmd, next);

        }

    };

    /**
     * @documentation executes the command and writes into standard input of the process.
     *
     * @param cmd {String}
     * @param stdin {String}
     * @param next {Function}
     */
    /*istanbul ignore next */
    var execStdin = function (cmd, stdin, next) {

        //create the process
        var c = cp.spawn(cmd);

        var stdout = null;
        var stderr = null;

        //write into stdin
        c.stdin.write(stdin);
        c.stdin.end();

        c.stdout.on('data', function (data) {

            stdout = stdout || "";
            stdout += data;

        });

        c.stderr.on('data', function (data) {

            stderr = stderr || "";
            stderr += data;

        });

        c.on('close', function (code) {

            //don't handle any codes here, just pass back to
            // the caller, they decide what to do with the result.
            return next(code, stdout, stderr);

        });

    };

    /**
     * @documentation executes a command that does not require writing to the process' stdin.
     *
     * @param cmd {String} the command to execute
     * @param next {Function} will be called when execution is done, takes three arguments, has signature next(err, stdout, stderr).
     */
    /*istanbul ignore next */
    var execOneLine = function (cmd, next) {

        //See docs for child_process.exec(): https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
        return cp.exec(cmd, next);

    };

    /**
     * Determines if the preconditions for the exec() function are met.
     *
     * @param cmd {String} test that this is a non-empty string.
     * @param stdin {String} test that if this is non-null, it is a string
     * @param next {Function} test that this is a function with three arguments.
     *
     * @return {Boolean} true if the preconditions are met, false otherwise.
     */
    var execPreconditions = function (cmd, stdin, next) {

        //check that cmd argument is valid
        if (!cmd || typeof cmd !== 'string' || cmd === "") {

            return false;

        }

        //stdin is allowed to null.
        if (stdin !== null && stdin !== undefined) {

            if (typeof stdin !== 'string' || stdin === "") {

                return false;

            }
        }

        if (!proc.sanitizeInput || proc.sanitizeInput.length !== 1) {

            return false;

        }


        if (!next || !(next instanceof Function) || next.length !== 3) {

            throw new CallbackInvalidError("UnixCommandLine.exec(String, String, Function) requires a callback function with three parameters.");

        }

        return true;

    };

    proc.execPreconditions = execPreconditions;
    proc._exec             = _exec;
    proc.execStdin         = execStdin;
    proc.execOneLine       = execOneLine;

    that.exec = exec;

    return that;

}

module.exports = {UnixCommandLine: UnixCommandLine};