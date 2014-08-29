'use strict';

/*
 * Module dependecies.
 */

var _ = require('lodash');
var winston = require('winston');
var clc = require('cli-color');
var highlight = require('console-highlight');
var moment = require('moment');

/*
 * Module configuration.
 */

var env = process.env.NODE_ENV || 'development';
var level = env == 'production' ? 'warn' : 'debug';
var colors = { debug: 'magenta', info: 'green', warn: 'yellow', error: 'red' };
var levels = { debug: 0, info: 1, warn: 2, error: 3 };

/*
 * Returns new logger instance.
 */

function create() {
  return new (winston.Logger)({
    levels: levels,
    colors: colors,
    transports: []
  });
}

/**
 * Winston instance.
 */

module.exports.instance = create();

/**
 * Preconfigured console transports.
 */

module.exports.transports = {

  /**
   * Console transport.
   *
   * @return {object}
   */

  console: function() {
    return function() {
      return new (winston.transports.Console)({
        level: level,
        formatter: function(lev, msg, meta) {

          // TODO: fix the formatter when https://github.com/flatiron/winston/pull/422 is merged

          var parts = msg.split(' ');
          var ident = '['+parts.shift()+']';
          var message = highlight(parts.join(' '), {
            theme: meta.theme || 'railscasts',
            language: meta.language || 'bash'
          }).replace(/\n|\r/g, ' ').replace(/\s{2,}/g, ' ');
          var timestamp = '['+moment().format('YYYY/MM/DD hh:mm:ss')+']';
          var level = '['+lev+']';
          return clc.xterm(8)(timestamp)+clc[colors[lev]](level)+clc.cyan(ident)+' '+message;
        }
      });
    };
  },

  /**
   * File transport.
   *
   * @param {object} options
   * @return {object}
   */

  file: function(options) {
    return function() {
      return new (winston.transports.File)(_.merge({
        level: level,
        filename: 'log/'+env+'.log',
        handleExceptions: true,
        maxsize: 1048576 * 10, // 10MB
        maxFiles: 1,
        json: false,
        formatter: function(lev, msg, meta) {

          // TODO: fix the formatter when https://github.com/flatiron/winston/pull/422 is merged

          var parts = msg.split(' ');
          var ident = '['+parts.shift()+']';
          var message = parts.join(' ');
          var timestamp = '['+moment().format('YYYY/MM/DD hh:mm:ss')+']';
          var level = '['+lev+']';
          return timestamp+level+ident+' '+message;
        }
      }, options));
    };
  }

};

/**
 * Log a message.
 *
 * @param(first) {string|object} level
 * @param {string+} ident
 * @param {string} message
 * @param {object} meta
 * @return {function}
 */

module.exports.log = function() {
  var args = Array.prototype.slice.call(arguments);

  var meta = args.shift();
  if (typeof meta == 'string') meta = { level: meta };
  var message = args.pop();

  var ident = args.join(':');
  module.exports.instance.log(meta.level, ident+' '+message, meta);
};

/**
 * Returns logger function.
 *
 * @param {string} level
 * @return {function}
 */

module.exports.fn = function(options) {
  // default arguments
  var defaults = [];
  if (options.prepend) defaults = [options.prepend].concat(defaults);
  defaults = [options].concat(defaults);
  if (options.append) defaults = [options.append].concat(defaults);
  // log function
  return function() {
    module.exports.log.apply(null, defaults.concat(Array.prototype.slice.call(arguments)));
  };
};
