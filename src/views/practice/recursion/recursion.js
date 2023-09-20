//递归
//计算1-5加起来的值
function getNum(n) {
  if (n >= 1) {
    return n + getNum(n - 1)
  }
  return 0
}
getNum(5)
//console.log(getNum(5))

const A = [
  {
    children: [
      {
        children: [
          {
            children: [{ width: 20 }, { width: 30 }, { width: 20 }],
          },
        ],
      },
    ],
  },
  { width: 30 },
  {
    children: [{ width: 10 }, { width: 30 }],
  },
]
// 计算表格列宽总和
//reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
//acc: 表示上一次调用回调时的返回值，或者初始值 init  cur: 表示当前正在处理的数组元素； 0为初始值
const sumColumn = (arr) =>
  arr.reduce(
    (acc, cur) =>
      Number(
        acc +
          (cur.children && cur.children.length
            ? sumColumn(cur.children)
            : cur.width),
      ),
    0,
  )
sumColumn(A) //结果为140；
//console.log(sumColumn(A))
