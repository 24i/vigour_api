'use strict'
var Api = require('../api')
var isNode = require('vigour-js/lib/util/is/node')
var fb
if (!isNode) {
  fb = require('vigour-facebook')
}

var login = {
  login: {
    val: new Api({
      facebook: {
        val: false,
        on: {
          data (data, event) {
            var login = this.parent
            fb.user.val = true
            fb.user.on('data', function (data) {
              login.emit('facebook', {id: this.id.val, token: this.token.val})
            })
          }
        }
      },
      define: {
        execute () {
          this.request(this.form.val)
        }
      }
    })
  }
}

exports.properties = login
