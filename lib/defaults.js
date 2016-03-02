 'use strict'

exports.properties = {
  parse (val) {
    this.define({ parse: val })
  }
}

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
  error () {
    // console.log('bitchass error')
  }
}
