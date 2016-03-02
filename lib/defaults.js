 'use strict'
function clearFields () {
  let origin = this.origin
  let key = this.payload
  let payload = key !== void 0  ? origin.get(key) : origin
  if (payload._base_version) {
    origin.data.origin.val = void 0
    origin.data.each(function (val) {
      val.origin.val = void 0
    })
  }
}

exports.on = {
  success: {
    val (val, event) {
      var origin = this.origin
      var state = origin.getRoot().state
      var modal = state.modal.current
      var notification = state.notification
      if (origin.notifications) {
        if (origin.notifications.success) {
          notification.set(origin.notifications.success, event)
        }
      }
      if (origin.success) {
        modal.set(origin.success, event)
      }
    },
    clearFields (val, event) {
      if (this.clearFields && this.clearFields.success) {
        clearFields.call(this)
      }
    }
  },
  error: {
    val (val, event) {
      var origin = this.origin
      var state = origin.getRoot().state
      var modal = state.modal.current
      var notification = state.notification
      if (origin.notifications) {
        if (origin.notifications.error) {
          notification.set(origin.notifications.error, event)
        }
      }
      if (origin.error) {
        modal.set(origin.error, event)
      }
    },
    clearFields (val, event) {
      if (this.clearFields && this.clearFields.error) {
        clearFields.call(this)
      }
    }
  }
}

exports.parse = function (val) {
  console.log(val)
}