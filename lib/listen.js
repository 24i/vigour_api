'use strict'
var status = require('./status')
var ApiError = require('./error')

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
        this.clear()
        this.emit('error', new Error(message.statusMessage))
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
        this.clear()
        if (json) {
          try {
            res = JSON.parse(res.toString())
          } catch (err) {
            err = new ApiError('Cannot parse response as JSON "' + this.path.join('.') + '" ')
            this.emit('error', err)
            return
          }
        }
        let isError = this.isError || this.lookUp('isError')
        if (isBad || (isError && isError(res))) {
          res = typeof res === 'object' ? JSON.stringify(res) : res
          this.emit(
            'error',
            new ApiError(
              'Wrong response "' + res + '" did not pass isError check "' + this.path.join('.') + '"'
            )
          )
        } else {
          this.emit('success', res)
        }
      })
    })
  }
}
