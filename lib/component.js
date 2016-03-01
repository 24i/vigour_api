'use strict'

exports.api = {
  properties: {
    headers: true, // { val: false}
    url: true, // this has to become an observable I suppose
    query: true,
    method: true, // rename --- httpMethod --> method
    encodeJson: true,
    withCredentials: true,
    currentRequest: true,
    duplex: true
  },
  currentRequest: false,
  duplex: false,
  encodeJson: false,
  withCredentials: false,
  loading: false,
  inject: [
    require('./poll'),
    require('./request')
  ],
  on: {
    data: {
      api () {
        // console.error('yo api!', this.key)
      }
    }
  },
  define: {
    abort () {
      if (this.currentRequest && this.loading.val) {
        this.currentRequest.abort()
        this.loading.val = false
      }
    }
  }
}
