/**
 * Generated On: 2015-7-17
 * Class: Action
 * Description: Describes a concrete business action to take on the objects within the data model. Controllers should use this interface to trigger the required processes.
 */

var NotImplementedError = require('../../util/error/NotImplementedError');

function Action(proc) {

    proc = proc || {};

    var that = {};

    /**
     * @param next { Function }
     */
    var doAction = function (next) {

        throw new NotImplementedError("Action.doAction() is an abstract method.");

    };

    /**
     * @documentation: Checks whether the conditions exist to correctly run the action. Must be implemented by each concrete action to check for specifics.
     *
     * @return  {Boolean}
     */
    var actionPreCondition = function () {

        throw new NotImplementedError("Action.actionPreCondition() is an abstract method.");

    };

    that.Action   = Action;
    that.doAction = doAction;

    proc.actionPreCondition = actionPreCondition;

    return that;

}


module.exports = {Action: Action};