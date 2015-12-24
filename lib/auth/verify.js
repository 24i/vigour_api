'use strict'
var Api = require('../api')

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

exports.properties = verify
