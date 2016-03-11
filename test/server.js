'use strict'
var http = require('http')
var server = module.exports = http.createServer((req, res) => {
  var body = ''
  res.writeHead(200, {'Content-Type': 'text/plain'})
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    var parsed
    if (body) {
      try {
        parsed = JSON.parse(body)
      } catch(e) {}
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
