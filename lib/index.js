'use strict'
var querystring = require('querystring')
var Observable = require('vigour-js/lib/observable')
var merge = require('vigour-js/lib/util/merge')
var request = require('hyperquest')

var Api = new Observable({
  url: {
    val: false
  },
  query: {
    val: Object(),
    on: {
      data: {
        api (data) {
          console.log(this)
          if (typeof data !== 'boolean') {
            merge(this.val, data)
          }
        }
      }
    }
  },
  httpMethod: {
    val: false
  },
  encodeJson: {
    val: false
  },
  headers: {
    val: Object(),
    on: {
      data: {
        api (data) {
          if (typeof data !== 'boolean') {
            merge(this.val, data)
          }
        }
      }
    }
  },
  loading: {
    val: false
  },
  define: {
    /**
     * Get some data in input and transforms it for the output. Should be
     * overwritten in order to provide custom functionalities
     */
    build (data) {
      return data
    },
    /**
     * Provides validations and returns them as an array of errors objects in the format:
     * { fieldName: errorMessage }
     */
    validate () {
      return []
    },
    /**
     * Executes the request. Id data is passed it will be used as body of the request
     */
    request (data) {
      console.log('API', 'request')
      var api = this
      if (api.loading.val) {
        console.warn('API is working, we need to implement caching for calls')
        return
      }
      api.loading.val = true

      var validationErrors = api.validate()
      if (validationErrors.length) {
        api.emit('validationError', validationErrors)
        return
      }
      console.log('API', 'validationErrros', validationErrors)

      data = api.build(data)

      console.log('API', 'data after build', data)

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

      console.log('API', 'request url', url)
      console.log('API', 'request opts', opts)

      var req = request(url, opts)

      if (httpMethod === 'post' || httpMethod === 'put') {
        if (data) {
          console.log('API', 'request is ' + httpMethod + ' with data', JSON.stringify(data))
          req.end(JSON.stringify(data))
        } else {
          console.log('API', 'request is post witouth data')
          req.end()
        }
      }

      req.on('response', function (message) {
        var requestStatuses = checkStatus(message)
        var isOk = requestStatuses[0]
        var isRedirect = requestStatuses[1]
        var isBad = requestStatuses[2]
        var isError = requestStatuses[3]

        if (isError || isBad) {
          api.emit('httpError', new Error(message.statusCode + ' raised by server'))
          return
        }

        if (isRedirect) {
          console.warn('API answered with 30X, redirect management is not implemented yet')
          return
        }

        if (isOk) {
          var res = ''
          message.on('data', function (chunk) {
            res += chunk
          })
          message.on('end', function () {
            if (api.encodeJson.val) {
              try {
                api.emit('response', JSON.parse(res.toString()))
              } catch (err) {
                api.emit('error', err)
              }
            } else {
              api.emit('response', res.toString())
            }
            api.loading.val = false
          })
        }
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
