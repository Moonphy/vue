import Vue from 'vue'
import Vuex from 'vuex'
import cachedata from './modules/cachedata'
import system from './modules/system'

Vue.use(Vuex)

export default new Vuex.Store({
  // 组合各个模块
  modules: {
    system,
    cachedata
  }
})
