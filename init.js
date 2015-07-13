'use strict';
var async = require('async'),
    _     = require('lodash'),
    logger = require('./lib/logger');


async.auto({
    environment: require('./lib/environment'),
    certificate: require('./lib/certificate'),
    httpd : require('./lib/httpd'),
    routes: require('./lib/routes')
}, complete);

/**
 * The final completion function. Throws any errors that arise, or listens.
 * @param {Error} error Any errors passed to us via `next(err, null)`` from tasks.
 * @param {Object} data The complete async data object.
 */
function complete(error, data) {
    if (error) {
        logger.error(error);
        throw error;
    }
    // No errors
    require('https').createServer(data.certificate, data.httpd.main)
        .listen(process.env.MAINPORT, function () {
            logger.success('Main listening on port ' + process.env.MAINPORT);
        });
    require('https').createServer(data.certificate, data.httpd.control)
        .listen(process.env.CONTROLPORT, function () {
            logger.success('Control listening on port ' + process.env.CONTROLPORT);
            logger.error("Some message");
        });
}
