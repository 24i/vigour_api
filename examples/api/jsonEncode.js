'use strict'
// -- DEMO CODE
// Showing some basic API functionalities
// demo used also for development
var Api = require('vigour-api').api

// passing query strings as json
var stringResponse = new Api({
  url: 'https://demo2052708.mockable.io/stringResponse',
  httpMethos: 'get',
  encodeJson: false,
  headers: {
    'Accept': 'text/plain'
  }
})

stringResponse.on('response', (data) => {
  console.log('ENCODE', 'on.response', 'data', data)
})

stringResponse.request()

// passing query strings as json
var errorForEncoding = new Api({
  url: 'https://demo2052708.mockable.io/stringResponse',
  httpMethos: 'get',
  encodeJson: true,
  headers: {
    'Accept': 'text/plain'
  }
})

errorForEncoding.on('error', (err) => {
  console.log('ENCODE', 'on.error', 'err', err)
})

errorForEncoding.request()
