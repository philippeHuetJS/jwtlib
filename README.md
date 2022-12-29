# jwtlib

[![CI status](https://img.shields.io/github/actions/workflow/status/philippeHuetJS/jwtlib/ci.yml)](https://github.com/philippeHuetJS/jwtlib/actions)
[![MIT license](https://img.shields.io/github/license/philippeHuetJS/jwtlib)](https://github.com/philippeHuetJS/jwtlib/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/philippeHuetJS/jwtlib)](https://github.com/philippeHuetJS/jwtlib/releases)

JSON Web Token library

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm](https://www.npmjs.com/) registry.

```sh
$ npm install jwtlib
```

## API

```js
var Token = require('jwtlib')
```

TypeScript:

```typescript
import Token from 'jwtlib'
```

### Token.sign(payload, options)

```js
var token = Token.sign({ prop: 'foo' })
console.log(token) // ey...
```

### Token.verify(token, options)

```js
setTimeout(function () {
  var decoded = Token.verify(token, {
    verify: {
      algorithms: ['RS512']
    }
  })
  console.log(decoded) // { prop: 'foo', ... }
}, 3000)
```

### Token.refresh(token, options)

```js
setTimeout(function () {
  var refreshToken = Token.refresh(token, {
    verify: {
      algorithms: ['RS512']
    }
  })
  console.log(refreshToken) // ey...
}, 3000)
```

## Description

Signs and verifies a secure token with SHA-512 algorithm for a trusted authentication.

## Features

 * access and refresh tokens

## Test

```sh
$ npm run test
```

## Documentation

Find [here](https://www.npmjs.com/package/jsonwebtoken) the official documentation.

## License

[MIT](LICENSE)
