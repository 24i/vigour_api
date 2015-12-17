'use strict'
var Observable = require('vigour-js/lib/observable')
var merge = require('vigour-js/lib/util/merge')

var Api = new Observable({
  key: 'generic-api',
  url: false,
  httpMethod: false,
  headers: {
    val: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    on: {
      data: {
        api (data) {
          console.log('data')
          this.val = merge(this.val, data)
        }
      }
    }
  }
}).Constructor

module.exports = Api
