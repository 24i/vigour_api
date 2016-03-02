'use strict'
var test = require('tape')
var http = require('http')
var Observable = require('vigour-observable')
var api = new Observable(require('../'))
var url = 'http://localhost:3333'

var server = http.createServer((req, res) => {
  console.log(req)
  emit.emit(req)
  res.writeHead(200, {'Content-Type': 'text/plain'})
  res.end('okay')
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
        field: 'its a field!'
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
  console.log(api)
  api.set({ simple: {} })
  api.simple.val = data.simple
})
