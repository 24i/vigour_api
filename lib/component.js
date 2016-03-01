'use strict'

exports.api = {
  properties: {
    headers: true, // { val: false}
    url: true, // this has to become an observable I suppose
    query: true,
    method: true, // rename --- httpMethod --> method
    json: true,
    credentials: true,
    stream: true
  },
  inject: [
    require('./poll'),
    require('./request')
  ],
  loading: false,
  on: {
    data: {
      api () {
        console.error('yo api!', this.key)
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
