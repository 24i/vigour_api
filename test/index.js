'use strict'
var test = require('tape')
var http = require('http')
var Api = require('..')

stringResponse.on('response', (data) => {
  console.log('ENCODE', 'on.response', 'data', data)
})

test('can make an http formData request', function (t) {
  t.plan(1)
  var stringResponse = new Api({
    url: 'http://demo4427401.mockable.io/stringResponse',
    method: 'get', // typo
    encodeJson: false,
    headers: {
      'Accept': 'text/plain'
    }
  })

  formLogin.request({
    username: 'valerio12345@mailinator.com',
    password: 'password'
  })

})

/*
"api": {
      "scraper": {
        "url": "http://adm-scraper.vigour.io/",
        "encodeJson": true,
        "headers": {
          "accept-encoding": "*",
          "accept": "application/json"
        }
      },
      "emailConfirm": {
        "url": "http://adm-proxy.vigour.io/email/confirm/",
        "encodeJson": true,
        "headers": {
          "accept": "application/json"
        }
      },
      "newsletter": {
        "url": "http://adm-proxy.vigour.io/user/",
        "encodeJson": true,
        "httpMethod": "put",
        "headers": {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      },
      "video": {
        "getSource": {
          "url": "http://adm-proxy.vigour.io/video/",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json"
          }
        },
        "sendPlayback": {
          "url": "http://adm-proxy.vigour.io/video/",
          "httpMethod": "post",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json"
          }
        },
        "sendEvent": {
          "url": "http://adm-proxy.vigour.io/video/event/",
          "httpMethod": "post",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json"
          }
        }
      },
      "password": {
        "forgot": {
          "url": "http://adm-proxy.vigour.io/password/forgot/",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json"
          }
        },
        "reset": {
          "url": "http://adm-proxy.vigour.io/password/reset",
          "encodeJson": true,
          "httpMethod": "post",
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      },
      "auth": {
        "verify": {
          "url": "http://adm-proxy.vigour.io/verify/",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json"
          }
        },
        "login": {
          "url": "http://adm-proxy.vigour.io/login/api",
          "httpMethod": "post",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        },
        "register": {
          "url": "http://adm-proxy.vigour.io/register",
          "httpMethod": "post",
          "encodeJson": true,
          "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      }
    }
  },
*/