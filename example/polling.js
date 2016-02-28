'use strict'
console.log('Request polling example')

var http = require('http')
var attempt = 0

function handleRequest (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.write('polling attempt ' + ++attempt)
  response.end()
}

var server = http.createServer(handleRequest)
server.listen(3333, function () {
  console.log('server started')
})

// Api
var Api = require('../')

// slow poll
// one request every second for infinite times
var slowPoll = new Api({
  url: 'http://localhost:3333/'
})
slowPoll.on('response', function (data) {
  console.log('[SLOW-INFINITE]', data)
})
slowPoll.poll(1000)

// medium poll
// one request every .5 seconds, max 100 times
var mediumPoll = new Api({
  url: 'http://localhost:3333/'
})
mediumPoll.on('response', function (data) {
  console.log('[MEDIUM]', data)
})
mediumPoll.poll(500, 100)

// crazy poll
// inifite requests as fast as possible
var crazy = new Api({
  url: 'http://localhost:3333/'
})
crazy.on('response', function (data) {
  console.log('[CRAZY]', data)
})
crazy.poll()
