'use strict'

exports.api = {
  type: 'observable',
  components: require('./component'),
  // here were making connections to notification, loading
  // will choose own child stuff before default -- this will make it super easy to use! yeey
  Child: { type: 'api' }
}
