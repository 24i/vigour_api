'use strict'
var querystring = require('querystring')
var Observable = require('vigour-js/lib/observable')
var request = require('hyperquest')

var Api = new Observable({
  properties: {
    headers: true,
    url: true,
    query: true,
    httpMethod: true,
    encodeJson: true,
    withCredentials: true,
  },
  encodeJson: false,
  withCredentials: false,
  loading: {
    val: false
  },
  define: {
    build (data) {
      return data
    },
    validate () {
      return []
    },
    request (data) {
      var api = this
      if (api.loading.val) {
        return
      }
      api.loading.val = true

      var validationErrors = api.validate()
      if (validationErrors.length) {
        api.loading.val = false
        api.emit('error', {type: 'validation', data: validationErrors})
        return
      }

      data = api.build(data)

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

      var httpMethod = api.httpMethod || 'get'
      var opts = {
        method: httpMethod,
        headers: api.headers
      }

      if (api.withCredentials !== 'undefined') {
        opts.withCredentials = api.withCredentials
      }

      var req = request(url, opts)

      if (httpMethod === 'post' || httpMethod === 'put') {
        if (data) {
          req.end(JSON.stringify(data))
        } else {
          req.end()
        }
      }

      req.on('response', function (message) {
        var requestStatuses = checkStatus(message)
        // var isOk = requestStatuses[0]
        var isRedirect = requestStatuses[1]
        var isBad = requestStatuses[2]
        var isError = requestStatuses[3]

        if (isError) {
          api.emit('error', {type: 500, data: new Error(message.statusMessage)})
          api.loading.val = false
          return
        }

        if (isRedirect) {
          api.loading.val = false
          return
        }

        var res = ''
        message.on('data', function (chunk) {
          res += chunk
        })
        message.on('end', function () {
          var data
          if (api.encodeJson) {
            try {
              data = JSON.parse(res.toString())
            } catch (err) {
              api.emit('error', {type: 'response', data: err})
              api.loading.val = false
              return
            }
          }
          if (isBad) {
            api.emit('error', {type: 400, data: res})
          } else {
            api.emit('response', data)
          }
          api.loading.val = false
        })
      })
    }
  }
}).Constructor

module.exports = Api

function checkStatus (message) {
  var res = []
  var statusCode = message.statusCode
  res[0] = statusCode - 200 < 100
  res[1] = statusCode - 300 < 100 && statusCode - 300 >= 0
  res[2] = statusCode - 400 < 100 && statusCode - 400 >= 0
  res[3] = statusCode - 500 < 100 && statusCode - 500 >= 0
  return res
}
