 'use strict'

exports.on = {
  success (val, event) {
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
      modal.set(origin.notifications.success, event)
    }
  },
  error (val, event) {
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
      modal.set(origin.notifications.success, event)
    }
    // console.log('bitchass error')
  }
}
