'use strict'
exports.properties = {
  isError (val) {
    this.define({ isError: val })
  },
  parse (val) {
    this.define({ parse: val })
  }
}
