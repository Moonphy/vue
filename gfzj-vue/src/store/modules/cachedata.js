import {
  SET_CATEGORY,
  SET_ALBUM,
  SET_USERINFO,
  SET_EXPERTWAY,
  SET_EXPERT
} from '../mutation-types'

// 状态初始化
var state = {
  albumList: '',
  category: '',
  expert: {}, // 更多专家，最近活跃(news)、热门推荐(hots)
  expertWay: {}, // index页专家方法设置1分钟缓存
  userinfo: {} // 包括用户信息及保存时间，如果当前时间比保存时间晚5分钟缓存内容失效要从新获取
}

// 状态变化
const mutations = {
  [SET_CATEGORY] (state, category) {
    state.category = category
  },

  [SET_ALBUM] (state, album) {
    state.albumList = album
  },

  [SET_USERINFO] (state, info) {
    state.userinfo = info
  },

  [SET_EXPERTWAY] (state, date) {
    state.expertWay = date
  },

  [SET_EXPERT] (state, expert) {
    state.expert = expert
  }

}

export default {
  state,
  mutations
}
