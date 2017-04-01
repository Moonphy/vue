/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function formatDate (date) {
  if (typeof date !== 'undefined' && date.length > 0) {
    date = date.replace(/T/, ' ').replace(/Z/, '')
    return date.replace(/\.\d+$/, '')
  } else {
    return date
  }
}

/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function uniformDate (date) {
  if (date) {
    date = fdate(date)
    var dateObj = splitDate(date)
    return dateObj.year + '-' + dateObj.month + '-' + dateObj.day + ' ' + dateObj.hours + ':' + dateObj.minutes + ':' + dateObj.seconds
  } else {
    return date
  }
}

/**
 * 日期格式化
 * @param  {String} value 目标日期字符串
 * @return {String}
 */
export function timestampToday (timestamp, beforeDay) {
  if (timestamp === '') return ''
  timestamp = fdate(timestamp)
  var nowTime = new Date()
  var dateTimes = 24 * 60 * 60 * 1000
  beforeDay = (beforeDay || 3) * dateTimes
  var bigTimes = nowTime - timestamp
  if (bigTimes > beforeDay) { // 如果时间已过去指定天数就直接显示日期，否则大于1天显示N天前，小于1天显示小时
    var D = splitDate(timestamp)
    return D.year + '-' + D.month + '-' + D.day
  }
  if (bigTimes > dateTimes) { // 显示几天前
    return Math.floor(bigTimes / dateTimes) + '天前' // 几天前
  }
  if (bigTimes > 60 * 60 * 1000) { // 显示小时
    return Math.floor(bigTimes / (60 * 60 * 1000)) + '小时前'
  }
  if (bigTimes > 60 * 1000) {
    return Math.floor(bigTimes / (60 * 1000)) + '分钟前'
  }

  if (bigTimes > 1000) {
    return Math.floor(bigTimes / (1000)) + '秒前'
  }
  return '刚刚'
}

export function cutString (v, num) {
  num = num || 20
  if (!v) return v
  return byteCut(v, num)
}

export function voiceTime (second) {
  let belift = []
  var minuteTime = 60
  var hourTime = minuteTime * 60
  if (second > hourTime) { // 显示小时
    var hour = Math.floor(second / hourTime)
    if (hour < 10) hour = '0' + hour
    second -= hour * hourTime
    belift.push(hour)
  }
  if (second > minuteTime) {
    var minute = Math.floor(second / minuteTime)
    if (minute < 10) minute = '0' + minute
    second -= minute * minuteTime
    belift.push(minute)
  } else {
    belift.push('00')
  }
  if (second < 10) second = '0' + second
  if (second === '0') {
    second = '00'
  }
  belift.push(second)
  return belift.join(':')
}

function fdate (date) {
  if (typeof date === 'string') {
    date = Number(date)
  }
  if (date < 2000000000) {
    date *= 1000
  }
  return date
}

function splitDate (date) {
  var formatDate = new Date(date)
  var year = formatDate.getFullYear().toString()
  var month = formatDate.getMonth() + 1 > 9 ? (formatDate.getMonth() + 1).toString() : '0' + (formatDate.getMonth() + 1).toString()
  var day = formatDate.getDate() > 9 ? formatDate.getDate().toString() : '0' + formatDate.getDate().toString()
  var hours = formatDate.getHours() > 9 ? formatDate.getHours().toString() : '0' + formatDate.getHours().toString()
  var minutes = formatDate.getMinutes() > 9 ? formatDate.getMinutes().toString() : '0' + formatDate.getMinutes().toString()
  var seconds = formatDate.getSeconds() > 9 ? formatDate.getSeconds().toString() : '0' + formatDate.getSeconds().toString()
  return {year: year, month: month, day: day, hours: hours, minutes: minutes, seconds: seconds}
}

function byteLen (text) {
  var len = text.length
  var matcher = text.match(/[^\x00-\xff]/g)
  if (matcher) {
    len += matcher.length
  }
  return len
}

/**
 * 以字节为长度计算单位截取字符串，一个字两个字节
 * @param {String} text
 * @param {Number} length
 * @return {String} cutString
 */
function byteCut (str, length) {
  var wlen = byteLen(str)
  if (wlen > length) {
    // 所有宽字用&&代替
    var c = str.replace(/&/g, ' ')
         .replace(/[^\x00-\xff]/g, '&&')
    // c.slice(0, length)返回截短字符串位
    str = str.slice(0, c.slice(0, length)
        // 由位宽转为JS char宽
      .replace(/&&/g, ' ')
      // 除去截了半个的宽位
      .replace(/&/g, '').length
    )
  }
  return str
}
