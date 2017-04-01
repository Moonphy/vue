import {
  SET_STATE,
  SET_ROUTER,
  SET_CID,
  SET_API_INTERFACE,
  ADD_NOTICE,
  REMOVE_NOTICE,
  SET_PROMPT,
  SET_WXINIT,
  SET_MACHINETYPE,
  SET_PULLLOADING
} from '../mutation-types'

// 状态初始化
var state = {
  loading: false,
  pullloading: false,
  notices: [],
  prompt: '',
  wxinited: false, // false表示未注册、true表示注册成功、error表示注册失败
  componentId: 1,
  machineType: 'android', // 访问机器类型
  apiInterface: {testurl: 'http:www.gaofen.com', qlisturl: 'http://dev.fake.gaofen.com/m/specialist/special_list', hotUrl: 'http://dev.fake.gaofen.com/m/specialist/active_specialist_list', specialUrl: 'http://dev.fake.gaofen.com/m/specialist/special_list'},
  router: '/index'
}

// 状态变化
const mutations = {

  [SET_STATE] (state, isLoading) {
    state.loading = isLoading
  },

  [SET_PULLLOADING] (state, isLoading) {
    state.pullloading = isLoading
  },

  [SET_ROUTER] (state, router) {
    state.router = router
  },

  [SET_CID] (state) {
    state.componentId++
  },

  [SET_API_INTERFACE] (state, _interface) {
    state.apiInterface = _interface
  },

  [ADD_NOTICE] (state, notice) {
    state.notices.push(notice)
  },

  [REMOVE_NOTICE] (state) {
    state.notices.pop()
  },

  [SET_PROMPT] (state, prompt) {
    state.prompt = prompt
  },

  [SET_WXINIT] (state, v) {
    state.wxinited = v
  },

  [SET_MACHINETYPE] (state, type) {
    state.machineType = type
  }

}

export default {
  state,
  mutations
}
