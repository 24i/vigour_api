'use strict'
var request = require('hyperquest')
// var querystring = require('querystring')

exports.api = {
  properties: {
    method: true, // rename --- httpMethod --> method
    json: true,
    credentials: true,
    request: true,
    clearFields: true,
    payload: true,
    parse: true,
    data: true // this is a map for the payloads if you want to map things from data (not supported yet)
  },
  url () {
    return this.get('parent.parent.config.url.val')
  },
  inject: [
    require('./listen'),
    require('./poll') // all extras will come here
  ],
  parse: {
    val: '/{val}',
    fields: '?{name}={val}[,]'
  },
  clearFields: { success: true },
  loading: false,
  payload: 'data',
  on: {
    success () {
      console.log('mofo suc6!')
    },
    error () {
      console.log('bitchass error')
    },
    data: {
      api () {
        var origin = this.origin
        if (this.request) {
          console.log('!!!cancel this request!!!')
        }
        if (this.origin === this || !this.origin) {
          return
        }
        let headers = {}
        let config = this.parent.config || {}
        let method = this.method || config.method || 'GET'
        let json = this.json || config.json
        let credentials = this.credentials || config.credentials
        let key = this.payload
        let payload = key !== void 0  ? origin[key] : origin
        let url = (this.url && this.url.val) || (config.url && config.url.val)
        if (!url) {
          throw new Error('No url defined in api "' + this.path.join('.') +'"')
        }
        if (config.headers) {
          config.headers.each(parseHeader, void 0, headers)
        }
        if (this.headers) {
          this.headers.each(parseHeader, void 0, headers)
        }
        if (payload) {
          if (payload._base_version) {
            let val = payload.origin.val
            if (typeof payload.origin.val !== 'object') {
              payload = val
            } else {
              let convert = {}
              payload.origin.each(function (val, key) {
                convert[key] = val.val
              })
              payload = convert
            }
          }
        }
        let request = this.request = request({
          headers: headers,
          url: url
        })

        this.listen(request)

        if (method === 'POST') {
          request.end(payload)
        } else {
          request.end()
        }
        // request
        // notifications
        // success
        // error
        // fields -- default succes empty fields
        // do payload as well and clear by default

      }
    }
  }
}

function parseHeader (val, key, target, headers) {
  headers[key] = val.val
}