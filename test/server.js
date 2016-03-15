'use strict'
var http = require('http')
module.exports = http.createServer((req, res) => {
  var body = ''
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    var parsed
    if (body) {
      try {
        parsed = JSON.parse(body)
      } catch (e) {}
    }
    if (!body) { body = req.url }
    if (!parsed || !parsed.neverrespond) {
      res.end(body)
    } else {
      setTimeout(function () {
        res.end(body)
      }, 500)
    }
  })
}).listen(3333)
