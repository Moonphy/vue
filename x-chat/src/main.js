import Vue from 'vue'
import App from './App'
import Apart from './components/Apart' // 新创建的组件
import Bpart from './components/Bpart' // 新创建的组件
import VueRouter from 'vue-router' // 引入vue-router模块

Vue.use(VueRouter) // 安装 Vue.js 插件
/* 创建一个组件 并指定组件的template属性，类似穿件一个 const为ES6语法，标识声明一个不可改变的变量 */
const Error = {template: '<p style="color: red">is Error!!</p>'}

const routes = [  // 创建一个路由数组
  {
    path: '/',
    component: Apart // 将组件Apart作为路由‘/’下显示的组件
  },
  {
    path: '/bb',
    component: Bpart
  },
  {
    path: '*', // ‘*’代表在上面的路由中查找不到就默认显示‘*’路由的内容，必须放在最后，不然在‘*’之后的路由都不起作用
    component: Error
  }
]

const router = new VueRouter({ routes }) // 创建一个router对象
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, // 将router对象传给vue，这样就可以通过this.$router获取到router对象了
  template: '<App/>',
  components: { App }
})
