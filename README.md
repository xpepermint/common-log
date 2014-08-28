# common-log

[![NPM version](https://badge.fury.io/js/common-log.svg)](http://badge.fury.io/js/common-log)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/common-log.svg)](https://gemnasium.com/xpepermint/common-log)

Simple `logger` based on [winston](https://github.com/flatiron/winston) multi-transport async logging library for NodeJS.

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
logger.log('info', 'ident1', 'ident2', 'message');
// -> [debug][2014/08/28 03:28:53][ident1:ident2] mesage

// installing custom logger
var orm = require('orm-model');
orm.connect({ logger: logger.fn('debug') });
```
