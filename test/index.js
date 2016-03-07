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

test('post-http requests using multi-field payload', function (t) {
  t.plan(3)
  var obs = new Observable({
    data: { // maybe call this payload by default?
      field: 'a payload'
    }
  })
  api.set({ simple: {} })
  api.simple.val = obs
  api.simple.once('error', function (err, event) {
    t.equal(err instanceof ApiError, true)
    console.log(event, obs)
    // t.equal(event.type, '')
    obs.data.set({ success: true })
    this.once('success', function (data) {
      console.log('XXX', data)
    })
    obs.emit('data')
  })
})
