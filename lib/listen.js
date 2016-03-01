 'use strict'
 var status = require('./status')
 exports.define = {
  listen (stream) {
    stream.on('response', (message) => {
      var requestStatuses = status(message)
      var isRedirect = requestStatuses[1]
      var isBad = requestStatuses[2]
      var isError = requestStatuses[3]
      if (isError) {
        this.emit('error', new Error(message.statusMessage))
        this.loading.val = false
        this.stream = null
        return
      }
      if (isRedirect) {
        this.loading.val = false
        this.stream = null
        return
      }
      let res = ''
      message.on('data', function (chunk) {
        res += chunk
      })
      message.on('end', function () {
        if (this.json) {
          try {
            res = JSON.parse(res.toString())
          } catch (err) {
            this.emit('error', err)
            this.loading.val = false
            return
          }
        }
        if (isBad) {
          this.emit('error', new Error({type: 400, data: res}))
        } else {
          this.emit('success', res)
        }
        this.loading.val = false
        this.stream = null
      })
    })
  }
}
