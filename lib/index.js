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
  inject: require('./methods'),
  isError (res) {
    return (!res || res.success === false)
  },
  Child: { type: 'api' }
}
