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
    method: 'post',
    json: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  },
  Child: { type: 'api' }
}
