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

## Configuration

```js
var Api = require('vigour-api')

// JSON parse response
api.set({jsonEncode: true})

// HTTP Method
api.set({httpMethod: 'post'})



For more examples take a look at the [examples](examples) folder.
