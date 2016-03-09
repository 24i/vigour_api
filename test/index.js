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
  req.on('end', () => res.end(body))
}).listen(3333)

api.set({ config: { url: url } })

test('post request using a multi-field payload', function (t) {
  t.plan(2)
  api.set({ simple: {} })
  api.simple.set({
    a: true,
    b: true
  }).once('error', function (err) {
    this.once('success', function (data) {
      t.deepEqual(data, { a: true, b: true, success: true })
      this.b.set('b field')
      this.once('success', function (data) {
        t.equal(data.b, 'b field')
      })
      this.emit('data')
    })
    this.set({ success: true })
  })
})

test('post request using a multi-field payload over a reference', function (t) {
  t.plan(2)
  api.set({ simple: {} })
  var obs = new Observable({
    a: 'obs a',
    b: 'obs b'
  })
  api.simple.set(obs).once('error', function (err) {
    this.once('success', function (data) {
      t.deepEqual(data, { a: 'obs a', b: 'obs b', success: true })
      this.origin.b.set('obs b field')
      this.once('success', function (data) {
        t.equal(data.b, 'obs b field')
      })
      this.origin.emit('data')
    })
    obs.set({ success: true })
  })
})

test('payload field and mapPayload method', function (t) {
  t.plan(1)
  api.set({
    simple: {
      payload: 'data',
      mapPayload (payload, event) {
        return { success: true, special: true }
      }
    }
  })
  api.simple.once('success', function(data) {
    t.deepEqual(data, { success: true, special: true })
  })
  api.simple.set({
    data: 'something special'
  })
})

test('get method', function (t) {
  t.plan(1)
  api.set({
    simple: {
      method: 'GET'
    }
  })
  api.simple.once('success', function(data) {
    t.deepEqual(data, { success: true, special: true })
  })
})
