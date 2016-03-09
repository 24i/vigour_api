'use strict'
exports.properties = {
  poll: { type: 'observable' }
}

exports.poll = {
  $type: 'number',
  on: {
    data: {
      api () {
        var api = this.parent
        var poll = this
        var cnt = poll.max ? poll.max.val : true
        if (cnt > 0 || cnt === true) {
          api.emit('data')
          setTimeout(function () {
            if (cnt !== true) {
              poll.set({ max: --cnt })
            }
            api.poll.emit('data')
          }, poll.val)
        }
      }
    }
  }
}
