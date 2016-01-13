'use strict'
// -- DEMO CODE
// Showing some basic API functionalities
// demo used also for development
var Api = require('../')

// not encoding and no error
var stringResponse = new Api({
  url: 'http://demo4427401.mockable.io/stringResponse',
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

// encoding and throwing error
var errorForEncoding = new Api({
  url: 'http://demo4427401.mockable.io/stringResponse',
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