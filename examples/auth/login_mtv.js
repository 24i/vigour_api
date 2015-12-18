var auth = require('../../lib/auth')

// login errors
auth.login.on('error', (err) => {
  console.log('login', 'on.error', err)
})

// check when is working
auth.login.loading.on((isWorking) => {
  console.log('login', 'loading.on.data', isWorking)
  if (isWorking) console.log('login', 'loading.on.', 'Login started')
  else console.log('login', 'loading.on.', 'Login finished')
})

// login request setup
auth.login.set({
  url: 'https://utt.mtvnn.com/api/v2/sessions.json',
  httpMethod: 'post',
  headers: {
    'appVersion': '3'
  }
})

// response handler for specific implementations
auth.login.on('response', (data) => {
  console.log('login', 'on.response', data)
  auth.token.origin.set(data.authentication_token)
})

// auth has token property
auth.token.on((data) => {
  console.log('login', 'token.on.data', data)
})

// login
auth.login.login({
  user: {
    email: 'youri@vigour.io',
    password: 'testtest',
    app_version: '1.2.83'
  }
})
