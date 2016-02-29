'use strict'
var test = require('tape')
var http = require('http')
var Api = require('..')

var mockServer = http.createServer(function(res, req) {

  console.log('lulzzzz')

}).listen(3333)

test('can make an http request', function (t) {
  t.plan(1)

})
