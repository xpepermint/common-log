# common-log

[![NPM version](https://badge.fury.io/js/common-log.svg)](http://badge.fury.io/js/common-log)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/common-log.svg)](https://gemnasium.com/xpepermint/common-log)

Simple `logger` based on [winston](https://github.com/flatiron/winston) multi-transport async logging library for NodeJS.

![YoomJS](https://raw.githubusercontent.com/xpepermint/common-log/master/screenshot.png)

## Installation

Install the [npm](https://www.npmjs.org/package/common-log) package.

```
npm install common-log --save
```

## Example

```js
process.env.NODE_ENV = 'development';

var logger = require('common-log');
// attaching predefined Console transport
logger.instance.add(logger.transports.console());
// attaching predefined File transport (accepts options)
logger.instance.add(logger.transports.file());

// using logger
logger.log('debug', 'ident1', 'ident2', 'message'); // -> [2014/08/28 03:28:53][debug][ident1:ident2] mesage
logger.log('info', ...);
logger.log('warn', ...);
logger.log('error', ...);

// using logger with options
logger.log({
  level: 'debug',
  theme: 'railscasts', // color scheme
  language: 'sql', // colorizing style
  prepend: 'my-app', // add identifier at start
  append: 'my-action' // add identifier at end
}, ...);

// installing custom logger
var orm = require('orm-model');
orm.connect({ logger: logger.fn('debug') });
```
