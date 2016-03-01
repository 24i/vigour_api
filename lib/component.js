'use strict'
var request = require('hyperquest')
var status = require('./status')

exports.api = {
  properties: {
    headers: true, // { val: false}
    method: true, // rename --- httpMethod --> method
    json: true,
    credentials: true,
    request: true,
    clearFields: true
  },
  url () {
    var url = this.get('parent.config.url.val')
    return url && url + '/'
  },
  inject: [
    require('./poll') //all extra will come here
  ],
  clearFields: { success: true },
  loading: false,
  on: {
    reference: {
      api () {
        var config = this.parent.config || {}
        var method = this.method || config.method || 'GET'
        var json = this.json || config.json
        var credentials = this.credentials || config.credentials
        var url = (this.url && this.url.val) || (config.url && config.url.val)
        if (!url) {
          throw new Error('No url defined in api "' + this.path.join('.') +'"')
        }
        var headers = {}
        if (config.headers) {
          config.each(parseHeader, false, headers)
        }
        if (this.headers) {
          headers.each(parseHeader, false, headers)
        }

        console.error('yo api!', this.key, headers)

        // notifications
        // success
        // error
        // fields -- default succes empty fields
        // do payload as well and clear by default

      }
    }
  },
  define: {
    abort () {
      if (this.stream) {
        this.stream.abort()
        if (this.loading) {
          this.loading.val = false
        }
      }
    }
  }
}

function parseHeader (val, key, headers) {
  headers[key] = val.val
}