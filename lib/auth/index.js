'use strict'
var Observable = require('vigour-js/lib/observable')

module.exports = new Observable({
  inject: [
    require('./login'),
    require('./verify'),
    require('./signup')
  ]
})
