'use strict'
// -- DEMO CODE
// Showing some basic API functionalities
// demo used also for development
var Api = require('../')

// passing query strings as json
var queryJson = new Api({
  url: 'https://demo2052708.mockable.io/queryTest',
  httpMethos: 'get',
  query: {
    val: {
      query1: 'myQuery1',
      query2: 'myQuery2',
      query3: 'myQuery3',
      query4: 'myQuery4'
    }
  }
})

queryJson.on('response', (data) => {
  console.log('QUERY', 'on.response', 'data', data)
})

queryJson.request()

// passing query strings as string
var queryString = new Api({
  url: 'https://demo2052708.mockable.io/queryTest',
  httpMethos: 'get',
  query: 'query1=foo&query2=bar'
})

queryString.on('response', (data) => {
  console.log('QUERY', 'on.response', 'data', data)
})

queryString.request()
