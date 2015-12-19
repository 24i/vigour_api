'use strict'
var querystring = require('querystring')
var Observable = require('vigour-js/lib/observable')
var merge = require('vigour-js/lib/util/merge')
var request = require('hyperquest')

var postHeaders = {
  'Content-Type': 'application/json'
}

var Api = new Observable({
  query: {
    val: Object()
  },
  httpMethod: {
    val: false,
    on: {
      data: {
        api (data) {
          if (data === 'post') {
            merge(this.parent.headers.val, postHeaders)
          }
        }
      }
    }
  },
  encodeJson: {
    val: true
  },
  headers: {
    val: {
      'Accept': 'application/json'
    },
    on: {
      data: {
        api (data) {
          merge(this.val, data)
        }
      }
    }
  },
  loading: 0,
  define: {
    request (data) {
      var api = this
      if (api.loading.val) {
        console.warn('API is working, we need to implement caching for calls')
        return
      }
      api.loading.origin.val = 1

      var url = api.url.val

      // check query string
      var query = api.query.val
      if (typeof query === 'string') {
        url += '?' + query
      } else {
        var keys = Object.keys(api.query.val)
        if (keys.length) {
          url += '?' + querystring.stringify(api.query.val)
        }
      }

      var httpMethod = api.httpMethod.val || 'get'
      var opts = {
        method: httpMethod,
        headers: api.headers.val
      }

      var req = request(url, opts)

      if (httpMethod === 'post') {
        if (data) {
          req.end(JSON.stringify(data))
        } else {
          req.end()
        }
      }

      req.on('error', function (err) {
        console.log('api', 'error', err)
      })

      // TODO listen on response to catch status codes and analyze the HTTP.IncomingMessage
      req.on('data', function (data) {
        if (api.encodeJson.val) {
          api.emit('response', JSON.parse(data.toString()))
        } else {
          api.emit('response', data.toString())
        }
      })

      req.on('end', function () {
        api.loading.origin.val = 0
      })
    }
  }
}).Constructor

module.exports = Api

      // req.on('response', (message) => {
      //   // it will fail for redirects too, we need to follow redirects before this check
      //   if (message.statusCode !== 200) {
      //     console.log('api', 'httpError')
      //     api.emit('httpError', {
      //       code: message.statusCode,
      //       message: message.statusMessage
      //     })
      //   }
      //   // do we need to manage data conversion or we want to return the stream?
      //   var res
      //   message.on('data', (chunk) => {
      //     console.log('api', 'chunk')
      //     res += chunk
      //   })
      //   message.on('end', () => {
      //     console.log('api', 'end')
      //     if (api.encodeJson.val) {
      //       try {
      //         res = JSON.parse(res.toString())
      //       } catch (err) {
      //         api.emit('error', 'Not able to parse JSON response, sure it is JSON? response -> ' + res)
      //       }
      //     }
      //     api.emit('data', res)
      //     api.working.val = false
      //   })
      // })
      // req.on('error', (err) => {
      //   console.log('api', 'error')
      //   api.emit('error', err)
      // })
