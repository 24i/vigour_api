'use strict'
var Observable = require('vigour-js/lib/observable')

module.exports = new Observable({
  token: {
    val: false
  },
  inject: [
    require('./login')
  ]
})
