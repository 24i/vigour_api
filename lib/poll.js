'use strict'
exports.properties = {
  poll: { type: 'observable' }
}

exports.poll = {
  $type: 'number',
  properties: {
    timeout: true
  },
  on: {
    remove: {
      api () {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
      }
    },
    data: {
      api (data, event) {
        var api = this.parent
        if (
          data === null ||
          api.__input === null ||
          this.__input === null ||
          this.__input === void 0
        ) {
          return
        }
        var poll = this
        var val = poll.val
        var cnt = poll.max ? poll.max.val : true
        if (cnt > 0 || cnt === true) {
          api.emit('data', event)
          this.timeout = setTimeout(function () {
            if (cnt !== true) {
              poll.set({ max: --cnt })
            }
            if (api.__input !== null && api.poll.__input !== void 0) {
              api.poll.emit('data')
            }
          }, poll.val)
        }
      }
    }
  }
}
