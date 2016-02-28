'use strict'
console.log('Request abort example')

var http = require('http')
var attempt = 0

function handleRequest (request, response) {
  ++attempt
  setTimeout(function () {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.write('abort ' + attempt)
    response.end()
  }, 5000)
}

var server = http.createServer(handleRequest)
server.listen(3333, function () {
  console.log('server started')
})

// Api
var Api = require('../')

// slow poll
// one request every second for infinite times
var abortCandidate = new Api({
  url: 'http://localhost:3333/'
})

abortCandidate.on('response', function (data) {
  console.log('you should see me just one time')
  console.log(data)
})

abortCandidate.loading.on('data', function () {
  console.log('Loading changed: ', abortCandidate.loading.val)
})

setTimeout(function () {
  abortCandidate.request()
  setTimeout(function () {
    abortCandidate.request()
    setTimeout(function () {
      abortCandidate.request()
      setTimeout(function () {
        abortCandidate.request()
        setTimeout(function () {
          abortCandidate.request()
        }, 200)
      }, 200)
    }, 200)
  }, 200)
}, 200)
