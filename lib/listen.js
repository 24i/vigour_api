'use strict'
var status = require('./status')
var ApiError = require('./error')
var Event = require('vigour-event')

exports.define = {
  clear () {
    var event = new Event('api-loading')
    var loading = this.loading
    if (loading.timeout) {
      clearTimeout(loading.timeout)
    }
    if (loading.min && loading.min.val) {
      let elapsed = Date.now() - loading.start
      if (elapsed < loading.min.val) {
        loading.timeout = setTimeout(function () {
          loading.origin.set(false, event)
          event.trigger()
        }, loading.min.val - elapsed)
      } else {
        loading.origin.set(false, event)
        event.trigger()
      }
    } else {
      loading.origin.set(false, event)
      event.trigger()
    }
    this.request = null
  },
  listen (stream, json) {
    stream.on('response', (message) => {
      if (this.__input === null || this.origin.__input === null) {
        return
      }
      var requestStatuses = status(message)
      var isRedirect = requestStatuses[1] // why would we want to block redirects?
      var isBad = requestStatuses[2]
      var isErrorStatus = requestStatuses[3]
      if (isErrorStatus) {
        this.clear()
        this.emit('error', new Error(message.statusMessage))
        return
      }
      let res = ''
      message.on('data', (chunk) => { res += chunk })
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
          res = typeof res === 'object' ? JSON.stringify(res, false, 2) : res
          this.emit(
            'error',
            new ApiError(
              'Wrong response "' + res + '" did not pass isError check for "' + this.path.join('.') + '"'
            )
          )
        } else {
          this.emit('success', res)
        }
      })
    })
  }
}
