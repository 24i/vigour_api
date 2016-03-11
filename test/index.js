'use strict'
var test = require('tape')
var http = require('http')
var Observable = require('vigour-observable')
var api = new Observable(require('../').api)
var url = 'http://localhost:3333'
var ApiError = require('../lib/error')

if (require('vigour-util/is/node')) {
  let server = require('./server')
  test.onFinish(function () {
    server.close()
    process.exit()
  })
}

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
    t.deepEqual(data, { success: true, special: true }, 'received correct payload')
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
      api.simple.remove()
    })
  })
  api.simple.set('hello')
})

// make a helper function to clean this up a bit (remove the pyramid)
test('loading observable', function (t) {
  t.plan(5)
  api.set({ simple: {} })
  api.simple.loading.once(function (data) {
    t.equal(data, true, 'loading')
    this.once(function (data) {
      var time = Date.now()
      t.equal(data, false, 'loading complete')
      this.set({ min: 100, max: 200 })
      this.once(function (data) {
        t.equal(data, true, 'loading, minimum time of 100ms')
        this.once(function () {
          var d = Date.now()
          var elapsed = d - time
          time = d
          t.equal(elapsed > 99, true, 'loading time is larger then 99ms')
          api.simple.set({ neverrespond: true })
          this.once(function (data) {
            d = Date.now()
            elapsed = d - time
            t.equal(elapsed < 210, true, 'loading time is less then 210ms')
            api.simple.remove()
          })
        })
      })
      api.simple.set({ success: false })
      api.simple.emit('data')
    })
  })
  api.simple.set({ success: true })
})

test('poll', function (t) {
  t.plan(5)
  api.set({
    simple: {
      method: 'GET',
      poll: { val: 100, max: 5 },
      json: false,
      isError (val) {
        return typeof val !== 'string'
      }
    }
  })
  var cnt = 0
  api.simple.on('success', function (data) {
    t.equal(data, '/hello', 'poll success: ' + (++cnt))
  })
  api.simple.set('hello')
})

function testResponses (api, t) {
    var success = 0
    var error = 0
    var obs = new Observable()
    api.on('success', function () { success++ })
    api.on('error', function () { error++ })
    api.set(void 0)
    api.set(obs)
    obs.set('')
    api.set({ url: { $add: '/bla' }})
    // using timeouts since we want to test if responses are handled or not
    setTimeout(function () {
      fired()
      obs.set(100)
      setTimeout(function () {
        fired('setting reference', 0, 1)
        api.remove()
        t.end()
      }, 100)
    }, 100)

    function fired (msg, good, bad) {
      if (!good) { good = 0 }
      if (!bad) { bad = 0 }
      msg = msg ? msg + ', ' : ''
      t.equal(error, bad, msg + 'error fired: ' + bad)
      t.equal(success, good, msg + 'success fired: ' + good)
    }
  }

test('post request listeners fire correctly', function (t) {
  api.set({ something: {} })
  testResponses(api.something, t)
})

test('get request listeners fire correctly', function (t) {
  api.set({ something: { method: 'GET' } })
  testResponses(api.something, t)
})
