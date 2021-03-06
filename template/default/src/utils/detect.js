/**
 * 检测工具类
 * Created by GG on 2018/1/9.
 */

const UA = window.navigator.userAgent

const isIos = /ipad|iphone|ipod|ios/i.test(UA)
const isAndroid = /android|adr/i.test(UA)
const isNewsapp = /(newsapp|newsapppro)\//i.test(UA)
const isWeixin = /micromessenger/i.test(UA)
const isDev = process.env.NODE_ENV === 'development'
const isDebug = /debug/i.test(location.search)
const isTest = /test\.html$/.test(location.pathname)
const isOnline = /index\.html$/.test(location.pathname)

export {
  isIos,
  isAndroid,
  isNewsapp,
  isWeixin,
  isDev,
  isDebug,
  isTest,
  isOnline,
}
