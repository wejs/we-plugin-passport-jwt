# we-plugin-passport-jwt

[![npm version](https://badge.fury.io/js/we-plugin-passport-jwt.svg)](https://badge.fury.io/js/we-plugin-passport-jwt) [![Build Status](https://travis-ci.org/wejs/we-plugin-passport-jwt.svg?branch=master)](https://travis-ci.org/wejs/we-plugin-passport-jwt) [![Coverage Status](https://coveralls.io/repos/github/wejs/we-plugin-passport-jwt/badge.svg?branch=master)](https://coveralls.io/github/wejs/we-plugin-passport-jwt?branch=master)

JWT authentication strategy plugin for We.js build with jsonwebtoken and passport-jwt

## Installation

```sh
we i we-plugin-passport-jwt
```

## Configuration

Documentation about configuration:

See:

- https://www.npmjs.com/package/passport-jwt 
- https://www.npmjs.com/package/jsonwebtoken

```js
    // --- 
    passport: {
      strategies: {
        // session
        jwt: {
          secretOrKey: null, // REQUIRED!
          
          // optional configs:
         
          algorithm: 'HS256',
          audience: null, // will be set after load all plugins
          issuer: 'wejs.org',
          jwtid: null,
          subject: null,
          noTimestamp: null,
          header: null,
          expiresIn: 10080, // in seconds

          session: false,    
        }
      }
    },
    // ---

```

## routes:

### Authenticate and get token:

**post /auth/jwt/authenticate**

Post **email** and **password** to /auth/jwt/authenticate.

## Links

- We.js site: http://wejs.org

## NPM Info:

[![NPM](https://nodei.co/npm/we-plugin-passport-jwt.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/we-plugin-passport-jwt/)

## License

Under [the MIT license](https://github.com/wejs/we-core/blob/master/LICENSE.md).
