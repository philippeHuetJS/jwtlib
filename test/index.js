'use strict'

var assert = require('assert')
var { v4: uuidv4 } = require('uuid')

var Token = require('..')

var generateUUID = function () {
  return uuidv4()
}

var options = {
  audience: 'sega-*',
  issuer: 'https://connect.sega.com/1/',
  subject: 'phuet'
}

describe('.sign(payload, options)', function () {
  it('should require an argument', function () {
    var accessToken = Token.sign.bind(null)

    assert.throws(accessToken, /The "payload" argument.*required./)
  })

  it('should be of type object', function () {
    var accessToken = Token.sign.bind(null, 'foo')

    assert.throws(accessToken, /The "payload" argument.*object./)
  })

  it('should sign a token', function () {
    var accessToken = Token.sign(
      { prop: 'foo' },
      Object.assign(options, { jwtid: generateUUID() })
    )

    assert.match(accessToken, /ey/)
  })
})

describe('.verify(token, options)', function () {
  it('should require an argument', function () {
    var decoded = Token.verify.bind(null)

    assert.throws(decoded, /The "token" argument.*required./)
  })

  it('should be of type string', function () {
    var decoded = Token.verify.bind(null, { prop: 'foo' })

    assert.throws(decoded, /The "token" argument.*string./)
  })

  it('should verify a token', function () {
    var accessToken = Token.sign(
      { prop: 'foo' },
      Object.assign(options, { jwtid: generateUUID() })
    )

    setTimeout(function () {
      var decoded = Token.verify(accessToken, {
        verify: {
          algorithms: ['RS512'],
          audience: this.audience,
          issuer: this.issuer,
          subject: this.subject,
          nonce: this.jwtid
        }
      })
      assert.ok(decoded)
    }, 3000)
  })
})

describe('.refresh(token, options)', function () {
  it('should require an argument', function () {
    var refreshToken = Token.refresh.bind(null)

    assert.throws(refreshToken, /The "token" argument.*required./)
  })

  it('should be of type string', function () {
    var refreshToken = Token.refresh.bind(null, { prop: 'foo' })

    assert.throws(refreshToken, /The "token" argument.*string./)
  })

  it('should refresh a token', function () {
    var accessToken = Token.sign(
      { prop: 'foo' },
      Object.assign(options, { jwtid: generateUUID() })
    )

    setTimeout(function () {
      var refreshToken = Token.refresh(accessToken, {
        verify: {
          algorithms: ['RS512'],
          audience: this.audience,
          issuer: this.issuer,
          subject: this.subject,
          nonce: this.jwtid
        },
        jwtid: generateUUID()
      })
      assert.match(refreshToken, /ey/)
    }, 3000)
  })
})
