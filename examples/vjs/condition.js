var Observable = require('vigour-js/lib/observable')

var Obs = new Observable({
  val: false,
  on: {
    data: {
      condition (data, done, event) {
        if (data > 0) {
          done(new Error('must be 0'))
        } else {
          done()
        }
      }
    }
  }
}).Constructor

var a = new Obs({
  on: {
    error (err) {
      console.log('ERROR', err)
    },
    data: {
      login (data, event) {
        console.log('emit data event :)')
      }
    }
  }
})

setTimeout(() => {
  console.log('Seeting \'a\' as 0 should not emit error and emit data event')
  a.val = 0
}, 200)

setTimeout(() => {
  console.log('Seeting \'a\' as != 0 should emit error')
  a.val = 1
}, 800)

