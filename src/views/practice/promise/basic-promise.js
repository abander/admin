const promise = new Promise((resolve, reject) => {
  resolve('success 1111111111')
  reject('err')
})

promise.then(
  (value) => {
    console.log('resolve', value)
  },
  (reason) => {
    console.log('reject', reason)
  },
)
