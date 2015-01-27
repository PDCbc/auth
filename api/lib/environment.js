'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');

/**
* This task sets and checks for ENV variables which the application cares about.
* @param {Function} next The callback for node async
*/
function environment(next) {
    if (!process.env.SECRET) {
        // SECRET is used for cookies and sessions. Make sure to choose something password-y.
        logger.warn('No $SECRET present. Generating a temporary random value.');
        process.env.SECRET = require('crypto').randomBytes(256);
    }
    if (!process.env.PORT) {
        // PORT is what the application listens on.
        logger.warn('No $PORT present. Choosing a sane default, 8080.');
        process.env.PORT = 8080;
    }
    if (!process.env.FEDERATION) {
        // PORT is what the application listens on.
        logger.warn('No $FEDERATION present. Choosing a default: `pdc.dev`.');
        process.env.FEDERATION = "pdc.dev";
    }
}

// This task has no dependencies.
module.exports = environment;
