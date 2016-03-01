'use strict'
module.exports = function checkStatus (message) {
  var res = []
  var statusCode = message.statusCode
  res[0] = statusCode - 200 < 100
  res[1] = statusCode - 300 < 100 && statusCode - 300 >= 0
  res[2] = statusCode - 400 < 100 && statusCode - 400 >= 0
  res[3] = statusCode - 500 < 100 && statusCode - 500 >= 0
  return res
}
