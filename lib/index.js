'use strict'
var querystring = require('querystring') // why not qs? the most popular one
var Observable = require('vigour-observable')
var request = require('hyperquest') //from node 4.1 hyperquest way for doing http is integrated in core-node

var Api = new Observable({
  properties: {
    headers: true,
    url: true, // this has to become an observable I suppose
    query: true,
    method: true, // rename --- httpMethod --> method
    encodeJson: true,
    withCredentials: true,
    currentRequest: true,
    duplex: true
  },
  currentRequest: false,
  duplex: false,
  encodeJson: false,
  withCredentials: false,
  loading: false,
  poll: {
    val: 0,
    properties: { max: true }, // why no observable?
    max: 9.007199254740991e+15, // what about 0?
    on: {
      data () {
        var api = this.parent
        var poll = this
        var cnt = poll.max
        if (cnt === Infinity || cnt >= 0) {
          api.on('response', function () {
            // need to handle on remove everywhere --- this can leak
            setTimeout(function () {
              poll.set({ max: --cnt })
            }, poll.val)
            // timeout needs to cleared on remove
          }, 'api-polling')
          api.request()
        }
      }
    }
  },
  define: {
    build (data) {
      return data
    },
    validate () {
      return [] // dont think we need this anymore
    },
    abort () {
      if (this.currentRequest && this.loading.val) {
        this.currentRequest.abort()
        this.loading.val = false
      }
    },
    request (data) {
      var api = this
      if (api.duplex) {
        api.duplex.on('error', function () {})
        api.duplex.destroy ? api.duplex.destroy() : undefined
      }

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

      var method = api.method || 'get'
      var opts = {
        method: method,
        headers: api.headers
      }

      if (api.withCredentials !== 'undefined') {
        opts.withCredentials = api.withCredentials
      }

      api.duplex = request(url, opts)
      api.loading.val = true

      if (method === 'post' || method === 'put') {
        if (data) {
          api.duplex.end(JSON.stringify(data))
        } else {
          api.duplex.end()
        }
      }

      api.duplex.on('request', function (req) {
        if (api.duplex.destroy) return
        api.duplex = req
      })

      api.duplex.on('response', function (message) {
        var requestStatuses = checkStatus(message)
        // var isOk = requestStatuses[0]
        var isRedirect = requestStatuses[1]
        var isBad = requestStatuses[2]
        var isError = requestStatuses[3]

        if (isError) {
          api.emit('error', {type: 500, data: new Error(message.statusMessage)})
          api.loading.val = false
          api.dublex = false // looks like a typo
          return
        }

        if (isRedirect) {
          api.loading.val = false
          api.dublex = false // looks like a typo
          return
        }

        var res = ''
        message.on('data', function (chunk) {
          res += chunk
        })
        message.on('end', function () {
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
          api.dublex = false
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
