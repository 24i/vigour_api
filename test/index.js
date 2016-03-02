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

function createAppData () {
  var data = new Observable({
    state: {
      notification: {},
      modal: { current: {} }
    }
  })
  return data
}

api.set({ config: { url: url } })

test('post-http requests using multi-field payload', function (t) {
  t.plan(9)
  var data = createAppData()
  data.set({
    simple: {
      api: 'simple',
      data: {
        field: 'a payload'
      },
      success: true,
      error: false,
      notifications: {
        error: {
          title: 'error',
          subtitle: 'sub-error'
        },
        success: {
          title: 'success',
          subtitle: 'sub-success'
        }
      }
    }
  })
  api.set({ simple: {} })
  api.simple.val = data.simple
  api.simple.once('error', (err) => {
    t.equal(err instanceof ApiError, true)
  })
  data.state.notification.once(function () {
    t.equal(this.origin, data.simple.notifications.error)
    data.simple.data.set({ success: true })
    data.state.notification.once(function () {
      t.equal(this.origin, data.simple.notifications.success)
    })
    data.simple.emit('data')
  })
  data.state.modal.current.once(function () {
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

test('get-http requests using single and multi-field payload', function (t) {
  t.plan(2)
  var data = createAppData()
  data.set({
    title: 'hello',
    simpleget: { data: [ '$', 'title' ] }
  })
  api.set({ simpleget: { method: 'GET' } })
  api.simpleget.once('error', () => {
    t.equal(serverUrl, '/hello')
    data.simpleget.data.set({
      val: void 0,
      a: true,
      b: true
    })
    data.simpleget.emit('data')
    api.simpleget.once('error', () => {
      t.equal(serverUrl, '/?a=true&b=true')
    })
  })
  api.simpleget.val = data.simpleget
})

test('polling', function (t) {
  t.plan(5)
  var data = createAppData()
  data.set({
    title: 'hello',
    simpleget: {
      data: [ '$', 'title' ]
    }
  })
  api.set({
    simpleget2: {
      method: 'GET',
      poll: { val: 10, max: 5 }
    }
  })
  api.simpleget2.on('error', function (err) {
    t.equal(err instanceof ApiError, true)
  })
  api.simpleget2.val = data.simpleget
})

// todo: kill server when done
