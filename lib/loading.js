'use strict'
exports.properties = {
  loading: {
    type: 'observable',
    properties: {
      start: true,
      timeout: true
    },
    on: {
      remove () {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
      }
    }
  }
}
