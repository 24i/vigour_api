'use strict'
var Api = require('../base')
var fb = require('vigour-facebook')

// LOGIN MUST BE A PROPERTY, NOT A CLASS, MOVE THIS TO auth.js
var Login = new Api({
  username: {
    val: false,
    on: {
      data (data, event) {
        if (this.username.val && this.password.val) {
          this._login()
        }
      }
    }
  },
  password: {
    val: false,
    on: {
      data (data, event) {
        if (this.username.val && this.password.val) {
          this._login()
        }
      }
    }
  },
  facebook: {
    val: false,
    on: {
      data (data, event) {
        fb.val = true
      }
    }
  },
  define: {
    _login () {

    }
  }
}).Constructor

module.exports = Login

// How to have Auth as Observable amd being able to inject different Apis (login, verify, ....)
// var Auth = new Observable({
//   inject: require('./login')
// })
