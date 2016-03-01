'use strict'
exports.poll = {
  $type: 'number',
  on: {
    data: {
      api () {
        var api = this.parent
        var poll = this
        var cnt = poll.max ? pol.max.val : true
        if (cnt >= 0 || cnt === true) {
          api.on('response', function () {
            // reuse event
            // need to handle on remove everywhere --- this can leak
            setTimeout(function () {
              if (cnt !== true) {
                poll.set({ max: --cnt })
              }
            }, poll.val)
            // timeout needs to cleared on remove
          }, 'api-polling')
          api.request() // wtf this dont need it
        }
      }
    }
  }
}
