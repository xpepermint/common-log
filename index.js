'use strict';

/*
 * Module dependecies.
 */

var _ = require('lodash');
var cstrip = require('strip-ansi');
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
          var message = highlight(parts.join(' '), { theme: 'railscasts' }).replace(/\n/g, '').replace(/\s{2,}/g, ' ');
          var timestamp = '['+moment().format('YYYY/MM/DD hh:mm:ss')+']';
          var level = '['+lev+']';
          return clc[colors[lev]](level+timestamp)+clc.cyan(ident)+' '+message;
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
        filename: 'logs/'+env+'.log',
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
          return level+timestamp+ident+' '+message;
        }
      }, options));
    };
  }

};

/**
 * Log a message.
 *
 * @param(first) {string} level
 * @param(*) {string} ident
 * @param(last) {string} message
 * @return {function}
 */

module.exports.log = function() {
  var args = Array.prototype.slice.call(arguments);
  var level = args.shift();
  var message = args.pop();
  var ident = args.join(':');
  module.exports.instance[level](ident+' '+message);
};

/**
 * Returns logger function.
 *
 * @param {string} level
 * @return {function}
 */

module.exports.fn = function(level) {
  return function() {
    module.exports.log.apply(null, [level].concat(Array.prototype.slice.call(arguments)));
  };
};
