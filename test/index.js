'use strict'
var test = require('tape')
var http = require('http')
var Observable = require('vigour-observable')
var api = new Observable(require('../').api)
var url = 'http://localhost:3333'
var ApiError = require('../lib/error')
var serverReqs = 0
var serverUrl

var server = http.createServer((req, res) => {
  var body = ''
  serverReqs++
  serverUrl = req.url
  res.writeHead(200, {'Content-Type': 'text/plain'})
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    res.end(body)
  })
}).listen(3333)

api.set({ config: { url: url } })

test('post request using a multi-field payload', function (t) {
  // t.plan(3)
  api.set({ simple: {} })
  api.simple.set({
    a: true,
    b: true
  })
  t.end()
})
