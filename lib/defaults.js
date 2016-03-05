 'use strict'
function clearFields () {
  let origin = this.origin || this
  let key = this.payload
  let payload = (key !== void 0 && key !== false) ? origin.get(key) : origin
  if (payload && payload._base_version) {
    payload.origin.set(void 0, false)
    payload.each(function (val) {
      val.origin.set(void 0, false)
    })
  }
}

exports.on = {
  success: {
    val (val, event) {
      var origin = this.origin
      var state = origin.getRoot().state
      if (state) {
        var modal = state.modal
        var notification = state.notification
        if (origin.notifications) {
          if (origin.notifications.success) {
            notification.set(origin.notifications.success, event)
          }
        }
        if (origin.success) {
          modal.set({ previous: void 0 })
          modal.set({ current: origin.success }, event)
        }
      }
    },
    clearFields (val, event) {
      if (this.clearFields && this.clearFields.success) {
        clearFields.call(this)
      }
      event.on('close', () => {
        this.set(void 0, false)
      })
    }
  },
  error: {
    val (val, event) {
      var origin = this.origin
      var state = origin.getRoot().state
      if (state) {
        var modal = state.modal
        var notification = state.notification
        if (origin.notifications) {
          if (origin.notifications.error) {
            notification.set(origin.notifications.error, event)
          }
        }
        if (origin.error) {
          modal.set({ previous: void 0 })
          modal.set({ current: origin.error }, event)
        }
      }
    },
    clearFields (val, event) {
      if (this.clearFields && this.clearFields.error) {
        clearFields.call(this)
      }
      event.on('close', () => {
        this.set(void 0, false)
      })
    }
  }
}

exports.parse = function (url, payload) {
  if (typeof payload === 'object') {
    var str = '?'
    for (let i in payload) {
      str += i + '=' + payload[i] + '&'
    }
    return url + str.slice(0,-1)
  } else {
    return url + '/' + payload
  }
}