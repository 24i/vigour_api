'use strict'
var Api = require('../../../lib/api.js')

describe('testing base api class functionalities', () => {
  var api

  it('will able to create instance', () => {
    api = new Api()
  })

  it('will have url, httpMetod and headers properties with presets for headers', () => {
    expect(api.httpMethod.val).to.be.false
    expect(api.httpMethod.val).to.equal(0)
    expect(api.headers.val).to.have.property('Accept').and.equal('application/json')
  })

  it('will merge new headers if passed as new value', () => {
    api.headers.val = {
      'foo': 'bar',
      'bar': 'baz',
      'Accept': 'text/plain'
    }
    expect(api.headers.val).to.have.property('Accept').and.equal('text/plain')
    expect(api.headers.val).to.have.property('foo').and.equal('bar')
    expect(api.headers.val).to.have.property('bar').and.equal('baz')
  })
})
