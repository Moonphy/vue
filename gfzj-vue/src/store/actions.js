// action 会收到 store 作为它的第一个参数
// 既然我们只对事件的分发（dispatch 对象）感兴趣。（state 也可以作为可选项放入）
// 我们可以利用 ES6 的解构（destructuring）功能来简化对参数的导入
import * as types from '../store/mutation-types'
import api from '../api/api'

export const setCid = ({ dispatch }) => {
  dispatch(types.SET_CID)
}

export const getInterface = ({ dispatch }, _interface) => {
  dispatch(types.SET_API_INTERFACE, _interface)
}

export const getCurrent = ({ dispatch }, router) => {
  dispatch(types.GET_NAVS, router)
}

export const setState = ({ dispatch }, states) => {
  dispatch(types.SET_STATE, states)
}

export const setPullLoad = ({ dispatch }, states) => {
  dispatch(types.SET_PULLLOADING, states)
}

export const addNotice = ({ dispatch }, notice, times) => {
  dispatch(types.ADD_NOTICE, notice)
  setTimeout(() => {
    dispatch(types.REMOVE_NOTICE)
  }, times || 2500)
}

export const setPrompt = ({ dispatch }, prompt) => {
  dispatch(types.SET_PROMPT, prompt)
}

export const setRouter = ({ dispatch }, router) => {
  dispatch(types.SET_ROUTER, router)
}

export const getUsers = ({ dispatch }, params) => {
  api.user.getUsers().then((res) => {
    dispatch(types.GET_USERS, res.data.rst)
  }).catch((res) => {
    // this.handleError(res)
  })
  // dispatch(types.SET_STATE, states)
}

export const getUser = ({ dispatch }, user) => {
  dispatch(types.SET_ROUTER, user)
}

export const addUser = ({ dispatch }, user) => {
  dispatch(types.ADD_USER, user)
}

export const setwxinit = ({ dispatch }, v) => {
  dispatch(types.SET_WXINIT, v)
}

export const setmachineType = ({ dispatch }, type) => {
  dispatch(types.SET_MACHINETYPE, type)
}

export const getalbum = ({ dispatch }) => {
  dispatch(types.GET_ALBUM)
}

export const setalbum = ({ dispatch }, album) => {
  dispatch(types.SET_ALBUM, album)
}

export const setcategory = ({ dispatch }, category) => {
  dispatch(types.SET_CATEGORY, category)
}

export const setuserinfo = ({ dispatch }, info) => {
  dispatch(types.SET_USERINFO, info)
}

export const setExpertWay = ({ dispatch }, data) => {
  dispatch(types.SET_EXPERTWAY, data)
}

export const setExpert = ({ dispatch }, data) => {
  dispatch(types.SET_EXPERT, data)
}

