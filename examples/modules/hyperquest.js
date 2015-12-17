var request = require('hyperquest')

// POST Example
var post = request('http://demo2052708.mockable.io/login', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  }
})
post.end(JSON.stringify({username: 'pippo'}))
post.on('error', function (err) {
  console.log('POST error', err)
})
post.on('data', function (data) {
  console.log('POST data', data.toString())
})
post.on('end', function () {
  console.log('POST end')
})

// GET Example
var get = request('http://demo2052708.mockable.io/userData/1', {
  method: 'get'
})
get.on('error', function (err) {
  console.log('GET error', err)
})
get.on('data', function (data) {
  console.log('GET data', data.toString())
})
get.on('end', function () {
  console.log('GET end')
})

// REDIRECT Example
var redirect = request('http://google.com', {
  method: 'get'
})
redirect.on('error', function (err) {
  console.log('REDIRECT error', err)
})
redirect.on('response', function (message) {
  console.log('REDIRECT response', 'message.statusCode', message.statusCode)
})
redirect.on('end', function () {
  console.log('REDIRECT end')
})
