var auth = require('../../lib/auth')

// login errors
auth.login.on('error', (err) => {
  console.log('login', 'on.error', err)
})

// login request, setup can be splitted by config properties and body
auth.login.set({
  url: 'http://demo2052708.mockable.io/login',
  httpMethod: 'post',
  headers: {
    'yo-header-title': 'yo-header-value'
  },
  username: 'xxx',
  password: 'xxx'
})

// response handler for specific implementations
auth.login.on('response', (data) => {
  console.log('login', 'on.response', data)
  var token = typeof data === 'string' ? data : data.token
  auth.token.origin.set(token)
})

// auth has token property
auth.token.on((data) => {
  console.log('login', 'token.on.data', data)
})

// useful for spinners, need check
// Q: Why doesn't fire?
auth.login.working.on('value', function (val) {
  console.log('login', 'working.on.value', val)
})
// Q: Why doesn't fire?
auth.login.working.on((isWorking) => {
  console.log('login', 'working.on.data', isWorking)
  if (isWorking) console.log('login', 'working.on.', 'Login started')
  else console.log('login', 'working.on.', 'Login finished')
})

// facebook
setTimeout(() => {
  auth.login.facebook.val = true
  auth.login.facebook.on('response', function () {
    console.log('facebook response')
  })
}, 1000)
