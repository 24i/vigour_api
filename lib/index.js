'use strict'

exports.api = {
  type: 'observable',
  components: require('./component'),
  config: {
    type: 'base',
    properties: {
      method: true,
      json: true,
      credentials: true
    },
    method: 'POST',
    json: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  },
  properties: {
    isError (val) {
      this.define({
         isError: val
      })
    }
  },
  isError (res) {
    return (!res || res.success === false)
  },
  Child: { type: 'api' }
}
