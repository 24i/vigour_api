'use strict'

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
