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
  t.plan(9)
  var data = new Observable({
    simple: {
      api: 'simple',
      data: {
        field: 'a payload'
      }
    }
  })
  api.set({ simple: {} })
  api.simple.val = data.simple
  api.simple.once('error', (err) => {
    t.equal(err instanceof ApiError, true)
    data.simple.data.set({ success: true })
    data.simple.emit('data')
  })
  api.once('success', function () {
    t.equal(this.val, false)
    this.once(function () {
      t.equal(this.val, true)
      var arr = []
      Object.defineProperty(api.simple, 'request', {
        get () {
          return this._request
        },
        set (val) {
          arr.push(val)
          this._request = val
        }
      })
      data.simple.emit('data')
      data.simple.emit('data')
      t.equal(arr.length, 3)
      t.equal(arr[1], null)
      process.nextTick(() => {
        var isEmpty = true
        t.equal(serverReqs, 2)
        data.simple.data.each(function (val) {
          if (val.val !== void 0) {
            isEmpty = false
          }
        })
        t.equal(isEmpty, true)
      })
    })
  })
})
