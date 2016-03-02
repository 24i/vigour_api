 'use strict'
 var status = require('./status')

 exports.define = {
  clear () {
    this.loading.origin.val = false
    this.request = null
  },
  listen (stream, json) {
    stream.on('response', (message) => {
      var requestStatuses = status(message)
      var isRedirect = requestStatuses[1]
      var isBad = requestStatuses[2]
      var isErrorStatus = requestStatuses[3]
      if (isErrorStatus) {
        this.emit('error', new Error(message.statusMessage))
        this.clear()
        return
      }
      if (isRedirect) {
        this.clear()
        return
      }
      let res = ''
      message.on('data', function (chunk) {
        res += chunk
      })
      message.on('end', () => {
        if (json) {
          try {
            res = JSON.parse(res.toString())
          } catch (err) {
            err.message = 'Cannot parse api response as JSON "' + this.path.join('.') + '" '
            this.emit('error', err)
            this.clear()
            return
          }
        }
        let isError = this.lookUp('isError')
        if (isBad || (isError && isError(res))) {
          this.emit('error', res)
        } else {
          this.emit('success', res)
        }
        this.clear()
      })
    })
  }
}
