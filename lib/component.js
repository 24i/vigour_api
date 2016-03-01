'use strict'
var request = require('hyperquest')
var status = require('./status')
// var querystring = require('querystring')

exports.api = {
  properties: {
    headers: true, // { val: false}
    method: true, // rename --- httpMethod --> method
    json: true,
    credentials: true,
    request: true,
    clearFields: true,
    data: true // this is a map for the payloads if you want to map things from data (not supported yet)
  },
  url () {
    return this.get('parent.parent.config.url.val')
  },
  inject: [
    require('./poll') //all extra will come here
  ],
  clearFields: { success: true },
  loading: false,
  on: {
    data: {
      api () {
        // may want to use data (so it fires when the origin changes think about it)
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
        if (origin.data) {

        }

        console.error('yo api!', this.key, headers, url)

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