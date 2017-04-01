/**
 * 共公API
 *
 */
import * as http from 'src/http'

export default {
  /**
   * 取微信签名
   * @return {Object}
   */
  getWxconfig (url, params) {
    return http.post(
      url, params
    )
  },

  getTest (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  /**
   * 上传微信serverid串
   * @return {Object}
   */
  uploadWeixinServerid (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  /**
   * 发布方法
   * @return {Object}
   */
  publishWay (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  getIndexPageData (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  // 发送回复
  answerQuestion (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  // 方法详细
  getWayDetail (url, params, opts) {
    return http.post(
      url, params, opts
    )
  },

  // 取一般数据方法

  getData (url, params, opts) {
    return http.post(
      url, params, opts
    )
  }

}
