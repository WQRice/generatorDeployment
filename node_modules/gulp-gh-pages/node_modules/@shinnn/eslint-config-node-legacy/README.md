# @shinnn/eslint-config-node-legacy

[![NPM version](https://img.shields.io/npm/v/@shinnn%2feslint-config-node-legacy.svg)](https://www.npmjs.com/package/@shinnn/eslint-config-node-legacy)
[![Build Status](https://travis-ci.org/shinnn/eslint-config-node-legacy.svg?branch=master)](https://travis-ci.org/shinnn/eslint-config-node-legacy)
[![Dependency Status](https://david-dm.org/shinnn/eslint-config-node-legacy.svg)](https://david-dm.org/shinnn/eslint-config-node-legacy)
[![devDependency Status](https://david-dm.org/shinnn/eslint-config-node-legacy/dev-status.svg)](https://david-dm.org/shinnn/eslint-config-node-legacy#info=devDependencies)

[shinnn](https://github.com/shinnn)'s [ESLint sharable config](http://eslint.org/docs/developer-guide/shareable-configs.html) for maintaining modules that still support [Node v0.x](https://github.com/nodejs/node-v0.x-archive)

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install @shinnn/eslint-config-node-legacy
```

## CLI

```
eslint --config @shinnn/node-legacy .
```

## API

```javascript
const CLIEngine = require('eslint').CLIEngine;

const cli = new CLIEngine({configFile: '@shinnn/node-legacy'});
cli.executeOnText('var foo=true;'); //=> {results: [ ... ], errorCount: ... }
```

## License

Copyright (c) 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
