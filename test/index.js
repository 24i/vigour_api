'use strict'
var test = require('tape')
var http = require('http')
var Api = require('..')

stringResponse.on('response', (data) => {
  console.log('ENCODE', 'on.response', 'data', data)
})

test('can make an http formData request', function (t) {
  t.plan(1)
  var stringResponse = new Api({
    url: 'http://demo4427401.mockable.io/stringResponse',
    method: 'get', // typo
    encodeJson: false,
    headers: {
      'Accept': 'text/plain'
    }
  })

  formLogin.request({
    username: 'valerio12345@mailinator.com',
    password: 'password'
  })

})
