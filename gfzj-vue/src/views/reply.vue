<template>
  <div class="form bg-white">
    <div class="q-item borer-b album-item">
        <div class="ui-avatar fl"><img :src="question.avatar_file" alt="alt"></div>
        <div class="item-content"><strong class="font-pink">{{question.user_name}}</strong>
            <p>{{question.question_name}}</p>
        </div>
        <div class="font-grey font-sm mt10"><span>来自</span><span class="font-pink">《{{question.topic_name}}》</span><span>支付了{{question.question_fee}}元向你提问</span>
        </div>
    </div>
<!--     <template v-for="item in items">
        {{item.name}}
        <template v-if="item.type===1">
          <div>==={{item.name}}</div>
        </template>
        <template v-if="item.type===2">
          <div>---{{item.name}}</div>
        </template>
    </template> -->
    <form>
      <div class="form-row mt10 pb30">
          <label class="font-pink">录制回复</label>
          <div class="input-row tc">
              <div :class="['btn-wrap-s', hasRecord?'':'hidden']"  @click.prevent="reset()">
                  <a class="btn btn-reset"></a>
                  <div class="font-grey">重置</div>
              </div>
              <div class="btn-wrap">
                  <a class="btn btn-start" v-if="!hasRecord && !recording"  @click.prevent="record()">
                    <p class="font-pink">点击录音</p>
                  </a>
                  <a class="btn btn-stop" v-if="recording" @click.prevent="recordOver()">
                    <p class="font-pink">停止录音</p>
                  </a>
                  <a class="btn btn-play" v-if="hasRecord && !recording && !playing"  @click.prevent="playRecord()">
                    <p class="font-pink">播放录音</p>
                  </a>
                  <a class="btn btn-stop" v-if="playing"  @click.prevent="stopPlayRecord()">
                    <p class="font-pink">停止播放</p>
                  </a>
                  <div class="font-grey">{{duration}}</div>
              </div>
              <div :class="['btn-wrap-s', hasRecord?'':'hidden']"><a class="btn btn-upload invisible"></a></div><a class="btn btn-block btn-primary"  :class="[hasRecord?'':'hidden']" @click.prevent="upload()">提交回复</a>
              <div class="font-grey font-sm tl">该提问为公开提问，您的回复每当被偷偷听一次，您将获得<span>0.4</span>元</div>
          </div>
        </div>
    </form>
  </div>
</template>
<script >
  import { globalMixins } from 'src/mixins.js'
  import { recordMixins } from 'src/recordmixin.js'
  import api from '../api/api'
  export default {
    name: 'reply',
    mixins: [globalMixins, recordMixins],
    data () {
      return {
        testTime: '1472554763',
        qid: '',
        initOk: false,
        question: {
          question_id: '',
          user_name: '',
          question_name: ''
        },
        items: [],
        maxRecord: 1,
        timer: 59000,
        uploadList: []
      }
    },
    watch: {
      // 'wxinited' () {

      // }
    },
    ready () {
      // console.log(this.$route)
      this.qid = this.$route.query.id
      if (!this.qid) {
        this.$route.router.go({path: '/index'})
        return
      }
      // this.wxsign()
      // this.setState(true)
      this.getData()

      this.wxplay()

      // var sign = true
      // this.setState(true)
      // api.common.getWxconfig(this.apiInterface.wxconfig, {url: window.location.href}).then((res) => {
      //   if (res.data.errno === 0) {
      //     let rsm = this.toJson(res.data.rsm)
      //     this.regwx(rsm, {
      //       debug: true
      //     }, '', (err) => {
      //       if (err) {
      //         sign = false
      //         self.addNotice({type: 'error', content: '微信签名失败-reply'})
      //         return
      //       }
      //       if (sign === false) return
      //       self.addNotice({type: 'success', content: '微信注册成功，可以录音!-reply'})
      //       self.initOk = true
      //       self.setState(false)
      //       window['wx'].onVoicePlayEnd({
      //         success: function (res) {
      //           self.playing = false
      //           self.currentIndex = 0
      //         }
      //       })
      //     })
      //   }
      // })
    },

    methods: {
      wxplay () {
        if (this.wxinited === 'error') {
          this.$dispatch('wxError', {
            wxpopup: true,
            wxpopupText: '录音不能正常工作，请扫描进入。<br><img src="/static/specialist/img/erweima.png" alt="二维码">'
          })
          // this.handleError('录音功能不正常，请重新打开！')
        }
        var self = this
        this.initOk = true
        window['wx'].onVoicePlayEnd({
          success: function (res) {
            self.playing = false
            self.currentIndex = 0
          }
        })
        // window['wx'].onVoiceRecordEnd({
        //   // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        //   complete: function (res) {
        //     self.way.title = 'autoStop'
        //   },
        //   success: function (res) {
        //     self.way.title = 'autoStop-success'
        //     var localId = res.localId
        //     self.recordIds.push(localId)
        //     self.stopRecordfn()
        //   }
        // })
      },
      getData () {
        api.common.getData(this.apiInterface.question_detail, {
          qid: this.qid
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.question = res.rsm
          }
        })
      },
      upload () {
        if (this.recordUploading === true) {
          return
        }
        if (this.recordIds.length === 0) return
        var self = this
        // this.question.user.name = '要上传了！'
        this.setState(true)
        window['wx'].uploadVoice({
          localId: this.recordIds[0], // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            api.common.uploadWeixinServerid(self.apiInterface.do_upload + '?' +
              self.toUrlParams({
                id: 'voice',
                field: 'voicefile',
                media_id: res.serverId
              }), {}).then((res) => {
                self.recordUploading = false
                self.addNotice({
                  type: 'success',
                  content: '录音上传成功！'
                })
                if (res.data.errno === 0) {
                  api.common.answerQuestion(self.apiInterface.answer,
                    {
                      qid: self.qid,
                      record_time: self.second,
                      answer_url: res.data.rsm.path
                    }).then(this.filterCallback).then((res) => {
                      self.addNotice({
                        type: 'success',
                        content: '回复成功！'
                      })
                      self.setState(false)
                      // 不作跳转
                      self.$route.router.go({path: '/replyed?id=' + self.qid})
                    }).catch(() => { self.setState(false) })
                } else {
                  self.setPrompt('提交失败，请稍后再试')
                }
              }).catch(() => {
                self.setState(false)
                self.recordUploading = false
              })
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/_audio-list'
  @import '../assets/stylus/publish'
</style>
