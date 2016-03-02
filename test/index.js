'use strict'
var test = require('tape')
var http = require('http')
var Observable = require('vigour-observable')
var api = new Observable(require('../').api)
var url = 'http://localhost:3333'
var ApiError = require('../lib/error')
var serverReqs = 0
var isEmpty = require('vigour-util/is/empty')

var server = http.createServer((req, res) => {
  var body = ''
  serverReqs++
  res.writeHead(200, {'Content-Type': 'text/plain'})
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => { res.end(body) })
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

test('can make post-http requests using payload', function (t) {
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
        t.equal(serverReqs, 2)
        t.equal(isEmpty(data.simple.data), true)
      })
    })
  })
})

// todo: kill server when done
