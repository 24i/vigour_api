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
  console.log('QUERY', 'on.response', 'data', data)
})

stringResponse.request()
