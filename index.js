/*!
 * jwtlib
 * Copyright(c) 2022 Philippe Huet
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var crypto = require('crypto')
var jwt = require('jsonwebtoken')

/**
 * Module exports.
 * @public
 */

module.exports = token()

/**
 * Module instances.
 * @private
 */

function token() {
  return new Token('RS512')
}

/**
 * Module constructors.
 * @private
 */

function Token(algorithm) {
  this.salt = crypto.randomBytes(16)

  this.key = crypto.scryptSync(
    JSON.stringify(process.env.KEY),
    this.salt,
    64,
    {
      cost: 1024
    }
  )

  var keys = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,

    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'blowfish',
      passphrase: this.key
    }
  })

  this.publicKey = keys.publicKey
  this.privateKey = keys.privateKey

  this.options = { algorithm, expiresIn: '2m', notBefore: '2s' }
}

/**
 * Method to sign a token.
 *
 * @param {JwtPayload} payload
 * @param {SignOptions} options
 * @returns {String}
 * @public
 */

Token.prototype.sign = function sign(payload, options) {
  if (!payload) {
    throw new TypeError('The "payload" argument is required.')
  }

  if (typeof payload !== 'object') {
    throw new TypeError('The "payload" argument must be an object.')
  }

  var opts = Object.assign({}, options, this.options)

  return jwt.sign(
    payload,
    {
      key: this.privateKey,
      passphrase: this.key
    },
    opts
  )
}

/**
 * Method to verify a token.
 *
 * @param {String} token
 * @param {VerifyOptions} options
 * @returns {Jwt}
 * @public
 */

Token.prototype.verify = function verify(token, options) {
  if (!token) {
    throw new TypeError('The "token" argument is required.')
  }

  if (typeof token !== 'string') {
    throw new TypeError('The "token" argument must be a string.')
  }

  return jwt.verify(token, this.publicKey, options.verify)
}

/**
 * Method to refresh a token.
 *
 * @param {String} token
 * @param {VerifyOptions} options
 * @returns {String}
 * @public
 */

Token.prototype.refresh = function refresh(token, options) {
  if (!token) {
    throw new TypeError('The "token" argument is required.')
  }

  if (typeof token !== 'string') {
    throw new TypeError('The "token" argument must be a string.')
  }

  var payload = jwt.verify(token, this.publicKey, options.verify)

  delete payload.iat
  delete payload.exp
  delete payload.nbf
  delete payload.jti

  var opts = Object.assign({}, this.options, {
    jwtid: options.jwtid
  })

  return jwt.sign(
    payload,
    {
      key: this.privateKey,
      passphrase: this.key
    },
    opts
  )
}
