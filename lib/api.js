'use strict'
var querystring = require('querystring')
var Observable = require('vigour-js/lib/observable')
var merge = require('vigour-js/lib/util/merge')
var request = require('hyperquest')

var Api = new Observable({
  query: {
    val: Object()
  },
  httpMethod: {
    val: false
  },
  encodeJson: {
    val: true
  },
  form: {
    val: Object(),
    on: {
      data: {
        singup (data) {
          if (typeof data !== 'boolean') {
            merge(this.val, data)
          }
        }
      }
    }
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
      var api = this
      if (api.loading.origin.val) {
        console.warn('API is working, we need to implement caching for calls')
        return
      }
      api.loading.origin.val = 1

      var validationErrors = api.validate()
      if (validationErrors.length) {
        if (validationErrors.length) {
          api.emit('validationError', validationErrors)
          return
        }
      }

      data = api.build(data)

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
        // do we want a specific error when it comes from requests? eg: httpError
        // this will allow us to listen for specific http error instead
        // of for generic api errors
        api.emit('error', err)
      })

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
          })
        }
      })

      req.on('end', function () {
        api.loading.origin.val = 0
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
