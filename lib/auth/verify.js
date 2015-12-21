'use strict'
var Api = require('../api')

// var Config = require('vigour-config')
// var config = new Config().api.verify

// console.log('config', config)
// console.log('config.serialize', config.serialize() )

// Verify Token
// uses the value in auth.token in requests
exports.properties = {
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
