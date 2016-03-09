'use strict'

// default parsing for get request
// for objects: some.url.org?field1=[val1]&field2=[val2]
// for single values: some.url.org/api/[val]
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
