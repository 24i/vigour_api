'use strict'
var Api = require('../api')
var isNode = require('vigour-js/lib/util/is/node')
var fb
if (!isNode) {
  fb = require('vigour-facebook')
}

exports.properties = {
  login: {
    val: new Api({
      facebook: {
        val: false,
        on: {
          data (data, event) {
            var login = this.parent
            fb.user.val = true
            fb.user.token.once(function () {
              login.emit('response', this.val)
            })
          }
        }
      },
      define: {
        login (data) {
          this.request(data)
        }
      }
    })
  }
}
