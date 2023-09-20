//数据劫持
function Ha(obj, callback) {
  const newObj = {}
  const arr = Object.keys(obj) //转化为数组
  arr.forEach((key) => {
    Object.defineProperty(newObj, key, {
      configurable: true,
      enumerable: true,
      get() {
        return obj[key]
      },
      set(val) {
        obj[key] = callback(val, key)
      },
    })
  })
  return newObj
}
const obj = {
  s: 1,
  m: 2,
  q: 3,
}
const data = Ha(obj, (val, key) => `smh想要修改对象obj的属性${key}为${val}`)
data.s = 5
console.log(data.s)
