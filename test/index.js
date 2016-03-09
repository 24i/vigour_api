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
    if (!body) { body = req.url }
    res.end(body)
  })
}).listen(3333)

api.set({ config: { url: url } })

function postRequest (t, target) {
  t.plan(2)
  api.set({ simple: {} })
  if (!target) {
    target = api.simple
  } else {
    api.simple.set(target)
  }
  api.simple.once('error', function (err) {
    this.once('success', function (data) {
      t.deepEqual(
        data,
        { a: true, b: true, success: true },
        'received correct payload'
      )
      target.b.set('b field')
      this.once('success', function (data) {
        t.equal(data.b, 'b field', 'received changed field b')
        api.simple.remove()
      })
      target.emit('data')
    })
    target.set({ success: true })
  })
  target.set({ a: true, b: true })
}

test('post request using a multi-field payload', postRequest)

test('post request using a multi-field payload over a reference', function (t) {
  postRequest(t, new Observable())
})

test('payload field and mapPayload method', function (t) {
  t.plan(2)
  api.set({
    simple: {
      payload: 'data',
      mapPayload (payload, event) {
        t.equal(payload, 'something special', 'parsed correct payload')
        return { success: true, special: true }
      },
      data: 'something special'
    }
  })
  api.simple.once('success', function(data) {
    t.deepEqual(data, { success: true, special: true })
    api.simple.remove()
  })
})

test('get method', function (t) {
  t.plan(2)
  api.set({
    simple: {
      method: 'GET',
      json: false,
      isError (val) {
        return typeof val !== 'string'
      }
    }
  })
  api.simple.once('success', function (data) {
    t.equal(data, '/hello', 'received parsed url "/hello"')
    this.set({
      val: void 0,
      a: true,
      b: true
    })
    this.once('success', function (data) {
      t.equal(data, '/?a=true&b=true', 'received parsed qeurystring "/?a=true&b=true"')
    })
  })
  api.simple.set('hello')
})
