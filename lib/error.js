'use strict'
var define = Object.defineProperty
module.exports = exports = function (val) {
  define(this, 'message', { value: val })
}
exports.prototype = new Error()
define(exports.prototype, 'name', { value: 'ApiError' })
