/**
 * 日期工具类封装方法
 * @author:
 * @since:
 */

export const previousDate = function (date, format, granularity) {
  granularity = granularity || 1000 * 3600 * 24
  let timeStep = isNaN(+date) ? new Date().getTime() : new Date().getTime() - granularity * date
  return fecha.format(timeStep, format || 'YYYY-MM-DD')
}

export const previousRangeDate = function (date, format) {
  return previousDate(date, format) + ',' + fecha.format(new Date(), format || 'YYYY-MM-DD')
}

//date1, date2为字符串YYYY-MM-DD
export const phaseDate = function (date1, date2) {
  let date1s = date1 ? new Date(date1.split('-')[0], date1.split('-')[1] - 1, date1.split('-')[2]) : new Date()
  let date2s = date2 ? new Date(date2.split('-')[0], date2.split('-')[1] - 1, date2.split('-')[2]) : new Date()
  let phase = date1s.getTime() - date2s.getTime()
  if (phase < 0) {
    phase = -phase
  }
  return phase / (1000 * 3600 * 24)
}

// 判断时间是否大于8.1
// true - 新单 false - 旧单
export const checkIfBillNew = function (time) {
  let headCreateDate = new Date(global.fecha.format(new Date(time), 'YYYY-MM-DD 00:00:00'))
  let lineDate = new Date('2018-08-01 00:00:00')
  return headCreateDate - lineDate >= 0
}

export const formatterDate = function () {
  var date_ = new Date()
  var year = date_.getFullYear()
  year = year.toString().substring(2)
  var month = date_.getMonth() + 1
  var day = date_.getDate()
  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day

  var hours = date_.getHours()
  var mins = date_.getMinutes()
  var secs = date_.getSeconds()
  var msecs = date_.getMilliseconds()
  if (hours < 10) hours = '0' + hours
  if (mins < 10) mins = '0' + mins
  if (secs < 10) secs = '0' + secs
  if (msecs < 10) secs = '0' + msecs

  return year + month + day + hours + mins + secs + msecs
}

export function dateFormatter(date, format) {
  let timeStep = date ? new Date(date.split('-')[0], date.split('-')[1] - 1, date.split('-')[2]) : new Date()
  return fecha.format(timeStep, format || 'YYYY年MM月DD日')
}

export function getMonthData() {
  let dataArr = []
  let data = new Date()
  // let year = data.getFullYear();
  // let month = data.getMonth() + 1;
  // let endDate = year - 1;	 //自定义截止年份时间 例如是2020年
  // let rate = year - endDate;
  // let monthNum = (rate - 1) * 12 + 11 + month;  //取到的月份

  data.setMonth(data.getMonth() + 1, 1) //获取到当前月份,设置月份
  for (let i = 0; i < 6; i++) {
    data.setMonth(data.getMonth() - 1) //每次循环一次 月份值减1
    let m = data.getMonth() + 1
    m = m < 10 ? '0' + m : m
    dataArr.push(data.getFullYear() + '-' + m)
  }
  return dataArr
}
