'use strict'
exports.poll = {
  val: 0,
  properties: { max: true }, // why no observable?
  max: 9.007199254740991e+15, // what about 0?
  on: {
    data () {
      var api = this.parent
      var poll = this
      var cnt = poll.max
      if (cnt === Infinity || cnt >= 0) {
        api.on('response', function () {
          // need to handle on remove everywhere --- this can leak
          setTimeout(function () {
            poll.set({ max: --cnt })
          }, poll.val)
          // timeout needs to cleared on remove
        }, 'api-polling')
        api.request()
      }
    }
  }
}
