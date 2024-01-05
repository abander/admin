function demo(id) {
  return new Promise((resolve, reject) => {
    /*
     *   模拟请求 id 不同定时器的时间也不同  模拟网络波动。
     *   没有promise卡住 执行顺序 4231
     *   使用promise卡住 执行顺序 1234
     *
     * */
    let time
    switch (id) {
      case 1:
        time = 1500
        break
      case 2:
        time = 700
        break
      case 3:
        time = 1100
        break
      case 4:
        time = 300
        break
    }
    setTimeout(() => {
      // 500ms 后请求成功 传出 id
      resolve({ id, flag: 'success' })
    }, time)
  })
}

const ids = [1, 2, 3, 4]

// 没卡住
console.log('----------------------------------------没卡住----------------------------------------------')
ids.forEach(async (id) => {
  const data = await demo(id) //看打印的顺序
  console.log(data)
})

// 原版卡住  问题 多次重复手写 const data1 =  await demo(ids[1])
/*async function run () {
    let i = 0
    const data =  await demo(ids[0]) //看打印的顺序
    console.log("----------------------------------------卡住----------------------------------------------");
    console.log(data)
    const data1 =  await demo(ids[1])
    console.log(data1)
    const data2 =  await demo(ids[2])
    console.log(data2)
    const data3 =  await demo(ids[3])
    console.log(data3)
}
run()*/

// 优化  卡住
const length = ids.length
let i = 0
async function t() {
  if (i < length) {
    const data = await demo(ids[i])
    if (i === 0)
      console.log('----------------------------------------卡住----------------------------------------------')
    i++
    console.log(data)
    t()
  } else {
    return false
  }
}
t()
