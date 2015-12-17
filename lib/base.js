'use strict'
var Observable = require('vigour-js/lib/observable')
var merge = require('vigour-js/lib/util/merge')
var request = require('hyperquest')

var Api = new Observable({
  key: 'base-api',
  url: false,
  httpMethod: false,
  body: false,
  query: false,
  encodeJson: false,
  headers: {
    val: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    on: {
      data: {
        api (data) {
          this.val = merge(this.val, data)
        }
      }
    }
  },
  define: {
    request () {
      var api = this
      var url = api.url.val
      if (!url) api.emit('error', new Error('url must be defined'))
      request(url, {
        method: api.httpMethod.val || 'get'
      }, (err, message) => {
        if (err) {
          api.emit('error', err)
          return
        }
        // it will fail for redirects too, we need to follow redirects before this check
        if (message.statusCode !== 200) {
          api.emit('httpError', {
            code: message.statusCode,
            message: message.statusMessage
          })
        }
        // do we need to manage data conversion or we want to return the stream?
        var res
        message.on('data', (chunk) => {
          res += chunk
        })
        message.on('end', () => {
          if (api.encodeJson.val) {
            try {
              res = JSON.parse(res.toString())
            } catch (err) {
              api.emit('error', 'Not able to parse JSON response, sure it is JSON? response -> ' + res)
            }
          }
          api.emit('data', res)
        })
      })
    }
  }
}).Constructor

module.exports = Api
