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
    else
    {
      logger.success('$SECRET present - ' + process.env.SECRET);
    }

    if (!process.env.MAINPORT) {
      // MAINPORT is what the application listens on for normal plane actions.
      logger.warn('No $MAINPORT present. Choosing a sane default, 3005.');
      process.env.MAINPORT = 3005;
    }
    else
    {
      logger.success('$MAINPORT present - ' + process.env.MAINPORT);
    }

    if (!process.env.CONTROLPORT) {
      // CONTROLPORT is what the application listens on for control plane actions.
      logger.warn('No $CONTROLPORT present. Choosing a sane default, 3006.');
      process.env.CONTROLPORT = 3006;
    }
    else
    {
      logger.success('$CONTROLPORT present - ' + process.env.CONTROLPORT);
    }

    if (!process.env.FEDERATION) {
      // PORT is what the application listens on.
      logger.warn('No $FEDERATION present. Choosing a default: `pdc.dev`.');
      process.env.FEDERATION = "pdc.dev";
    }
    else
    {
      logger.success('$FEDERATION present - ' + process.env.FEDERATION);
    }

    next(null);
}

// This task has no dependencies.
module.exports = environment;
