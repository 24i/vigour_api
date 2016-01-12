# Vigour API
An utility to perform API calls in Vigour style.

## Install
Since is not yet published on [npm](www.npmjs.org) you can add it to your dependencies with the line: `vigour-io/api` and npm will take care to download it (if you have the permissions to access the repository in GitHub)

## Example

```js
var Api = require('vigour-api')

// new Api
var weather = new Api()

// Setting options
weather.set({
  url: 'http://api.openweathermap.org/data/2.5/weather',
  httpMethos: 'get',
  query: {
    val: {
      appId: '1cece823ca4efb5bb1d43a449cb26bad',
      q: 'Amsterdam,nl'
    }
  }
})

// emitted on response
weather.on('response', (data) => {
  console.log('response', data)
})

// listening for http errors (eg: 50x, 40x)
weather.on('httpError', (err) => {
  console.warn('httpError', err)
})

// listening for generic error
weather.on('error', (err) => {
  console.error('error', err)
})

// useful if you want to implement spinners, data is `false` or `true`
weather.loading.on('data', (isWorking) => {
  console.log('Api is working', isWorking)
})

// executes the request
weather.request()
```

## Docs by examples

```js
// Require and create instance
var Api = require('vigour-api')
var api = new Api()

// Configure the API call: all at once, one by one or inject a config
// JSON parse response
api.set({encodeJson: true})s
// HTTP Method
api.set({httpMethod: 'post'})
// URL
api.set({url: 'http://www.google.com'})
// Query params
api.set({query: {
  foo: 'bar',
  beep: 'boop'
}})
// Headers
api.set({headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}})

// Set up listeners
// HTTP Errors like 50x or 40x
api.on('httpError', (err) => {
  console.log(err) // --> {HTTP STATUS CODE} raised by server
})
// Generic error, typically raised on data conversion error (eg JSON parse)
api.on('error', (err) => {
  console.log(err)
})
// Response emitter
api.on('response', (data) => {
  console.log(data) // --> requeste response object/string
})
// Validation error, if custom validation is passed this will be raise on error
api.on('validationError', (err) => {
  console.log(err) // --> {field: 'fieldName', message: 'error message'}
})

// Performing request
// plain, typically for GET or DELETE
api.request()
// passing some data in the body, typically POST or PUT
api.request({
  username: 'yo',
  password: 'yo'
})

// Adding custom validation
api.define({
  validate () {
    // grab fields
    var username = this.username.val
    var password = this.password.val
    // validation errors
    var errors = []
    // start custom validation
    if (!username) {
      errors.push({
        field: 'username',
        message: 'field required'
      })
    }
    if (!password) {
      errors.push({
        field: 'password',
        message: 'field required'
      })
    }
    // give back errors
    return errors
  }
})

// Adding custom data builder to send in body
// it will receive as argument what is passed through `api.request(data)`
api.define({
  build (data) {
    return {
      user: {
        username: data.username,
        password: data.password
      }
    }
  }
})
```
