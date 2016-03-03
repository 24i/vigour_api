'use strict'
var hyperquest = require('hyperquest')
// var querystring = require('querystring')
var ApiError = require('./error')

exports.api = {
  type: 'observable',
  properties: {
    method: true, // rename --- httpMethod --> method
    json: true,
    credentials: true,
    request: true,
    clearFields: true,
    payload: true,
    parse: true,
    isError (val) {
      this.define({ isError: val })
    },
    data: true // this is a map for the payloads if you want to map things from data (not supported yet)
  },
  url () {
    return this.get('parent.parent.config.url.val')
  },
  inject: [
    require('./common'),
    require('./listen'),
    require('./defaults'),
    require('./poll')
  ],
  clearFields: { success: true },
  loading: false,
  credentials: false,
  payload: 'data',
  define: {
    trigger (data, event, isref) {
      var origin = this.origin
      if (this.request) {
        this.request.emit('close')
        this.request = null
      }
      if (isref && (this.origin === this || !this.origin)) {
        this.clear(event)
        return
      }
      let headers = {}
      let config = this.parent.config || {}
      let method = this.method || config.method || 'GET'
      let json = this.json || config.json
      let credentials = this.credentials !== void 0 ? this.credentials : config.credentials
      let key = this.payload
      let payload = (key !== void 0 && key !== false)  ? origin.get(key) : origin
      let url = (this.url && this.url.val) || (config.url && config.url.val)
      if (!url) {
        throw new ApiError('No url defined "' + this.path.join('.') + '"')
      }

      if (!this.headers || this.headers.val !== false) {
        if (config.headers) {
          config.headers.each(parseHeader, void 0, headers)
        }
        if (this.headers) {
          this.headers.each(parseHeader, void 0, headers)
        }
      }

      if (payload) {
        if (payload._base_version) {
          //previousValue, event, origin, start, end, val
          // console.error(payload.val, )
          let val = payload.val
          if (typeof val !== 'object' && val !== void 0) {
            payload = val
          } else {
            let convert = {}
            payload.each(function (val, key) {
              convert[key] = val.val
            })
            payload = convert
          }
        }
      }

      if (payload === void 0 || payload === '') {
        return
      }

      this.loading.origin.set(true, event)
      if (method === 'GET') {
        url = this.parse(url, payload)
      }
      let request = this.request = hyperquest(url, {
        headers: headers,
        method: method,
        withCredentials: credentials
      })
      this.listen(request, json)
      if (method === 'POST') {
        try {
          payload = JSON.stringify(payload)
        } catch (e) {
          throw new ApiError('Cannot parse response as JSON "' + this.path.join('.') + '" ')
        }
        request.end(payload)
      }
    }
  },
  on: {
    reference: {
      api (data, event) {
        this.trigger(data, event, true)
      }
    }
  }
}

function parseHeader (val, key, target, headers) {
  headers[key] = val.val
}