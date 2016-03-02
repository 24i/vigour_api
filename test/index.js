'use strict'
var test = require('tape')
var http = require('http')
var Observable = require('vigour-observable')
var api = new Observable(require('../').api)
var url = 'http://localhost:3333'
var servObserv = new Observable({ properties: { req: true } })
var server = http.createServer((req, res) => {
  var body = ''
  res.writeHead(200, {'Content-Type': 'text/plain'})
  servObserv.set({ req: req })
}).listen(3333)

function createAppData () {
  var data = new Observable({
    state: {
      notification: {},
      modal: {
        current: {}
      }
    }
  })
  return data
}

api.set({ config: { url: url } })

test('can make a post-http request using payload', function (t) {
  t.plan(1)
  var data = createAppData()
  data.set({
    simple: {
      api: 'simple',
      data: {
        field: 'a payload'
      },
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
  servObserv.once((data) => {
    console.log()
  })
  api.set({ simple: {} })
  api.simple.val = data.simple
})
