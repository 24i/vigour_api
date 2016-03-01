'use strict'

exports.api = {
  type: 'observable',
  components: require('./component'),
  Child: { type: 'api' }
}
