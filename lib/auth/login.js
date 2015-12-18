'use strict'
var Api = require('../api')
var fb = require('vigour-facebook')

exports.properties = {
  login: {
    val: new Api({
      username: {
        val: false,
        on: {
          data (data, event) {
            var login = this.parent
            if (login.username.val && login.password.val) {
              login._login()
            }
          }
        }
      },
      password: {
        val: false,
        on: {
          data (data, event) {
            var login = this.parent
            if (login.username.val && login.password.val) {
              login._login()
            }
          }
        }
      },
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
        _login () {
          var login = this
          login.body = {
            username: login.username.val,
            password: login.password.val
          }
          this.request()
        }
      }
    })
  }
}
