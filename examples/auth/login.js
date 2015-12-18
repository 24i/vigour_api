var auth = require('../../lib/auth')

// login errors
auth.login.on('error', (err) => {
  console.log('login', 'on.error', err)
})

// useful for spinners, need check
auth.login.loading.on((isWorking) => {
  console.log('login', 'loading.on.data', isWorking)
  if (isWorking) console.log('login', 'loading.on.', 'Login started')
  else console.log('login', 'loading.on.', 'Login finished')
})

// adding custom response handler
auth.login.on('response', (data) => {
  console.log('login', 'on.response', data)
  var token = typeof data === 'string' ? data : data.token
  auth.token.origin.set(token)
})

// login request config
auth.login.set({
  url: 'http://demo2052708.mockable.io/login',
  httpMethod: 'post',
  headers: {
    'yo-header-title': 'yo-header-value'
  }
})

// login
auth.login.login({
  username: 'xxx',
  password: 'xxx'
})

// auth has token property
auth.token.on((data) => {
  console.log('login', 'token.on.data', data)
})

var isNode = require('vigour-js/lib/util/is/node')
if (!isNode) {
  // facebook
  setTimeout(() => {
    auth.login.facebook.val = true
  }, 1000)
}
