# api
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/vigour-api.svg)](https://badge.fury.io/js/vigour-api)
[![Build Status](https://travis-ci.org/vigour-io/api.svg?branch=master)](https://travis-ci.org/vigour-io/api)

Observable api calls [vigour-observable](https://github.com/vigour-io/observable).

## install
`npm i --save vigour-api`

## use
```js
// define an api
var Observable = require('vigour-observable')

var obs = new Observable({
 inject: require('vigour-api')
})

obs.api.set({
  google: {
    url: 'http://google.com',
    method: 'GET',
    isError (val) {
      return !val || typeof val !== 'object'
    },
    poll: 30e3
  }
})

//add listeners
obs.api.google.on('data', fn)
obs.api.google.on('success', fn)
obs.api.google.on('error', fn)

// use an api
obs.api.set('something')
// results in a get call to http://google.com/something

// api calls over a reference
var ref = new Observable()
obs.api.set(ref)

ref.set(100)
// results in a get call to http://google.com/100

ref.set(300)
// cancels current api call thats in progress and creates a get call to http://google.com/300
```
