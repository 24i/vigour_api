'use strict'
var Api = require('../api')

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

exports.properties = signup
