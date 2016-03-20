# api
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-api.svg)](https://badge.fury.io/js/vigour-api)
[![Build Status](https://travis-ci.org/vigour-io/api.svg?branch=master)](https://travis-ci.org/vigour-io/api)

Facilitating api calls, using [vigour-observable](https://github.com/vigour-io/observable).

## how to use
`npm i --save vigour-api`

##setup
```js
// define an api
var Observable = require('vigour-observable')
var api = require('vigour-api')

api.getSomeStuff = {
  type: 'api',
  url: someurl,
  method: 'GET',
  isError (val) {
    return !val || typeof val !== 'object'
  },
  poll: 30e3
}

var observableApi = new Observable(api)

//add listeners
observableApi.getSomeStuff.on('data', fn)
observableApi.getSomeStuff.on('error', fn)
```

*to be edited*
