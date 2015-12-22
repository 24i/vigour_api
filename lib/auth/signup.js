'use strict'
var Api = require('../api')
var merge = require('vigour-js/lib/util/merge')

// properties
// - form
//     will contain all the data sent to the signup API. Must be used for validations
//     every time something is added to form it will be merged with previous data
//     can be resetted settig it to `false`
// customisations
// - vlidate
//      override this function to allow validations
//      it must return an array
// emits
// - validationError
//      emits the result of this.validate()
exports.properties = {
  signup: {
    val: new Api({
      form: {
        val: Object(),
        on: {
          data: {
            singup (data) {
              if (typeof data === 'boolean') {
                this.val = false
              } else {
                merge(this.val, data)
              }
            }
          }
        }
      },
      define: {
        execute () {
          var validations = this.validate()
          if (validations.length) {
            this.emit('validationError', validations)
            return
          }
          var data = this.build(this.form.val)
          this.request(data)
        }
      }
    })
  }
}
