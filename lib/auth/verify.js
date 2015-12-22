'use strict'
var Api = require('../api')
var Config = require('vigour-config')

var config = new Config().api
config = config ? config.verify : null

// Verify Token or Email
// uses the value in auth.token in requests
var verify = {
  // inject: config,
  verify: {
    val: new Api({
      token: {
        val: false
      },
      email: {
        val: false
      },
      define: {
        execute () {
          this.request()
        }
      }
    })
  }
}

if (config) verify.inject = config.serialize()

exports.properties = verify
