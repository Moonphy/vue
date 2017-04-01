/**
 * 提问API
 *
 */
import * as http from 'src/http'

export default {
  /**
   * 提问列表
   * @return {Object}
   */
  questionList (url, params) {
    return http.post(
      url, params
    )
  },

  questionDetail (url, params) {

  }
}
