'use strict'
var Api = require('../')

var formLogin = new Api({
  url: 'https://vimond-rest-api.ha.tvae-first.vimondtv.com/api/authentication/user/login',
  http: 'post',
  encodeJson: true,
  headers: {
    'Accept': 'application/json;v=2',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

formLogin.request({
  username: 'valerio12345@mailinator.com',
  password: 'password'
})
