'use strict'
var Api = require('../api')
var Config = require('vigour-config')

var config = new Config().api
config = config ? config.signup : null

var signup = {
  signup: {
    val: new Api({
      define: {
        execute (data) {
          this.request(this.form.val)
        }
      }
    })
  }
}

if (config) signup.inject = config.serialize()

exports.properties = signup
