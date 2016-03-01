'use strict'
var querystring = require('querystring') // why not qs? the most popular one
var request = require('hyperquest') //from node 4.1 hyperquest way for doing http is integrated in core-node

exports.request = function (data) {
  var api = this
  if (api.stream) {
    // api.stream.on('error', function () {}) //why do we need a custom handler?
    api.stream.destroy ? api.stream.destroy() : void 0
  }
  data = data

  var url = api.url
  var query = api.query
  if (query && typeof query === 'string') {
    url += '?' + query
  } else if (typeof query === 'object') {
    var keys = Object.keys(api.query)
    if (keys.length) {
      url += '?' + querystring.stringify(api.query)
    }
  }

  var method = api.method || 'get'
  var opts = {
    method: method,
    headers: api.headers
  }

  if (api.withCredentials !== 'undefined') {
    opts.withCredentials = api.withCredentials
  }
  api.stream = request(url, opts)
  api.loading.val = true
  if (method === 'post' || method === 'put') {
    if (data) {
      api.stream.end(JSON.stringify(data))
    } else {
      api.stream.end()
    }
  }
  api.stream.on('request', function (req) {
    if (api.stream.destroy) return
    api.stream = req
  })
  api.stream.on('response', function (message) {
    var requestStatuses = checkStatus(message)
    // var isOk = requestStatuses[0]
    var isRedirect = requestStatuses[1]
    var isBad = requestStatuses[2]
    var isError = requestStatuses[3]
    if (isError) {
      api.emit('error', {type: 500, data: new Error(message.statusMessage)})
      api.loading.val = false
      api.stream = false // looks like a typo
      return
    }
    if (isRedirect) {
      api.loading.val = false
      api.stream = false // looks like a typo
      return
    }
    var res = ''
    message.on('data', function (chunk) {
      res += chunk
    })
    message.on('end', function () {
      // sharing events
      if (api.encodeJson) {
        try {
          res = JSON.parse(res.toString())
        } catch (err) {
          api.emit('error', {type: 'response', data: err})
          api.loading.val = false
          return
        }
      }
      if (isBad) {
        api.emit('error', {type: 400, data: res})
      } else {
        api.emit('response', res)
      }
      api.loading.val = false
      api.stream = false
    })
  })
}

function checkStatus (message) {
  var res = []
  var statusCode = message.statusCode
  res[0] = statusCode - 200 < 100
  res[1] = statusCode - 300 < 100 && statusCode - 300 >= 0
  res[2] = statusCode - 400 < 100 && statusCode - 400 >= 0
  res[3] = statusCode - 500 < 100 && statusCode - 500 >= 0
  return res
}
