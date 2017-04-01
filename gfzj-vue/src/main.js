import Vue from 'vue'
import VueRouter from 'vue-router'
// import VueForm from 'vue-form'
// import VueVlidator from 'vue-validator'
// import i18n from 'vue-i18n'
// import browser from './helpers/browser'

// 多语言配置文件
// import locales from './consts/locales/index'

// 指令
// import * as directives from './directives'

// 过滤器
import * as filters from './filters'

// 表单验证器
// import * as validators from './validators'

// 路由设置
import configRouter from './route-config'

import vueTap from 'vue-tap'

// 创建 vue 实例
var App = Vue.extend(require('./App'))

var router

// 调试模式
Vue.config.debug = process.env.NODE_ENV === 'production'

// 加载路由插件
Vue.use(VueRouter)

// 加载表单验证插件
// 详见：https://github.com/fergaldoyle/vue-form
// Vue.use(VueForm)
// Vue.use(VueVlidator)

// 注册全局指令
// ------------------------------
// Object.keys(directives).forEach((key) => {
//   Vue.directive(key, directives[key])
// })

// 注册全局过滤器
// ------------------------------
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// 注册全局验证器
// ------------------------------
// Object.keys(validators).forEach((key) => {
//   Vue.validator(key, validators[key])
// })
// 路由及其配置
router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
})
configRouter(router)

Vue.use(vueTap)

// 启动 App
router.start(App, '#app')
