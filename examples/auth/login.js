var Login = require('../../lib/auth/login')

var l = new Login()
setTimeout(() => {
  l.facebook.val = true
}, 1000)
