<template>
  <div class="audio-detail">
    <div class="audio-wrap">
      <img src="../assets/img/audio-bg.jpg" alt="" class="audio-bg">
      <div class="audio-container" :class="[playing ? 'play' : '']" @click="playMusic()">
        <img :src="O.topic_cover_url_big" alt="" class="audio-img">
        <div id="btn-play" data-state="pause" class="btn-play " >
          <audio id="music_player"></audio>
          <img src="../assets/img/icon-play.png" :class="[playing ? 'hidden' : '']" />
          <img src="../assets/img/icon-stop.png" :class="[playing ? '' : 'hidden']" />
        </div>
      </div>
      <div class="audio-title-wrap">
        <div id="audio-title">{{O.topic_name}}</div>
      </div>
      <div id="audio-brief">{{O.topic_description}}</div>
      <!-- 时间-->
      <div class="time" v-if="O.record_time">
        <div id="playTime">{{nowTime}}</div>
        <div id="totalTime">{{allTime|voiceTime}}</div>
      </div>
      <!-- 进度条-->
      <div id="audio-time-bar" class="audio-time-bar" @click="vtap($event)">
        <div class="w10"></div>
        <div id="progress-bar" class="progress-bar"><span id="bar-point"></span></div>
        <div id="load-present-bar "></div>
      </div>
    </div>
    <div class="author-wrap">
      <div class="clearfix mb10">
        <div class="fl">
          <div class="ui-avatar"><img :src="O.avatar_file" alt=""></div>
          <div class="icon-fav" v-if="O.fans_type===0" @click="follow()">关注</div>
          <div class="icon-fav had-fav" v-if="O.fans_type===1">已关注</div>
        </div>
        <div class="author-detail"><strong class="mr10">{{O.specialist_name}}</strong><span v-if="O.reason" class="ui-label ui-label-pink">{{O.reason | cutString 10}}</span>
          <p>{{O.specialist_signature}}</p>
        </div>
      </div>
      <div class="question-wrap" v-if="!asking && freeing" @click="toask()">
        <div class="tc pt30">
          <div class="limit-free"><img src="../assets/img/limit-free.png" alt="">
            <del class="font-pink-lither">提问&yen;5</del>
          </div>
          <div class="surplus-content">
            <p>剩余时间：<span>{{freeTime}}</span></p>
            <p>剩余问题：<span>{{O.free_question}} 条</span></p>
          </div>
        </div>
      </div>
      <div class="question-wrap"  @click="toask()"  v-if="!asking && !freeing">
        <div class="font-grey tc mt40">轻松付<span class="font-pink">{{O.question_fee}}元</span>，向Ta提问</div>
      </div>
      <div class="question-wrap opacitycs" v-if="asking" transition="opacitycs">
        <form>
          <textarea rows="3" v-model="askContent" id="askAreaText"></textarea>
          <div class="bg-grey clearfix">
            <i class="icon icon-light"></i>
            <span>专家72小时内未有回复将自动退款</span>
            <input type="button" value="{{askbtnText}}" class="btn btn-primary" @click.prevent="submitAsk()">
          </div>
        </form>
      </div>
      <div class="checked-wrap" :class="is_open ? 'selected':''" @click="is_open=!is_open"><i class="icon icon-check"></i><span class="font-grey">公开提问，答案每被偷偷听1次，从中获得&yen;0.4</span></div>
    </div>
    <div class="audio-list">
      <div class="ui-tab">
        <div :class="['tab', type === 1 ? 'active': '']" @click="stab(1)">
          <span>提问</span><span v-if="O.question_num">({{O.question_num}})</span>
        </div>
        <div :class="['tab', type === 2 ? 'active': '']"  @click="stab(2)">
          <span>专家方法</span><span v-if="O.topic_num">({{O.topic_num}})</span>
        </div>
      </div>
      <div class="tab-container opacitycs" v-show="type===1"  transition="opacitycs">
        <template v-if="qItems.length">
          <Qlist :items="qItems" @playAudio="playAudio()"></Qlist>
        </template>
        <template v-if="QpageStop && qItems.length === 0">
          <div class="list">
            <ul> <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> </ul>
          </div>
        </template>
      </div>
     <!-- 专家方法 -->
      <div class="tab-container opacitycs"  v-show="type===2"  transition="opacitycs">
        <template v-if="audioItems.length">
          <List :items="audioItems" :show-obj="showObj">
            <div slot="music_state">
              <div class="ui-state">
                <span class="line-1"></span>
                <span class="line-2"></span>
                <span class="line-3"></span>
              </div>
            </div>
          </List>
        </template>
        <template v-if="WpageStop && audioItems.length === 0">
          <div class="list">
            <ul> <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> </ul>
          </div>
        </template>
      </div>
    </div>
    <popup></popup>
  </div>
</template>
<script>
  import playerFactory from '../plugin/player/factory.js'
  import PlayerCtrl from '../plugin/player/player.ctrl.js'
  import { globalMixins } from 'src/mixins.js'
  import List from '../components/List.vue'
  import Qlist from '../components/Qlist.vue'
  import Popup from '../components/Popup.vue'
  import api from '../api/api'
  export default {
    name: 'detail',
    mixins: [globalMixins],
    components: {
      List,
      Qlist,
      Popup
    },
    data () {
      return {
        listLoading: false,
        show: true,
        isInit: false,
        tid: '', // 方法ID
        audioHandler: '',
        playing: false,
        playCtrlObj: '',
        QPage: 1, // 提问列表页码
        QpageStop: false,
        WPage: 1, // 方法列表页码
        WpageStop: false,
        loadPage: false,
        nowTime: '00:00',
        allTime: '',
        type: 1,
        asking: false,
        freeing: true,
        freeTime: 0,
        askContent: '',
        askbtnText: '发表提问',
        following: false,
        is_open: 1,
        O: { // 方法信息内容
          fans_type: 0,
          topic_id: '', // 方法id
          topic_name: '', // 音频标题
          topic_description: '', // 音频简介
          // topic_cover_url: '', // 音频封面地址
          topic_voice_url: '', // 音频地址
          specialist_name: '', // 专家名
          specialist_uid: '', // 专家uid
          question_fee: '', // 问题费用
          add_time: '', // 发布时间戳
          update_time: '', // 更新时间戳
          record_time: 0, // 录音时长
          topic_category_id: '', // 方法分类
          special_id: '', // 专辑id
          listen_num: '', // 收听数
          question_num: '', // 问题数
          free_question: '', // 免费问题数
          free_time: '', // 剩余免费时间戳
          avatar_file: '', // 头像地址
          specialist_signature: '', // 专家介绍
          reason: '', // 专家头衔
          topic_num: '', // 方法数
          add_question_url: '' // 提问接口地址
        },
        audioItems: [],
        qItems: [],
        showObj: {
          currentUrl: ''
        }
      }
    },
    computed: {
      'askbtnText' () {
        return this.freeing ? '发表提问' : '付费提问'
      }
    },
    watch: {
      'nowTime' (nv, ov) {
        if (nv !== '00:00') {
          this.setState(false)
        }
      }
    },
    ready () {
      var self = this
      this.tid = this.$route.query.tid
      if (!this.tid) {
        this.$route.router.go({path: '/index'})
        return
      }
      this.askContent = window.localStorage.getItem('askExpertText-' + this.tid) || ''
      this.getDetail(() => {
        self.initPage({
          getPage: self.getList
        })
      })
      // 解决在当前页面点击其它方法
      this.$on('change-route', (urlobj) => {
        this.reset()
      })

      // this.$dispatch('wxError', {
      //   wxpopup: true,
      //   wxpopupText: '录音不能正常工作，请扫描进入。<br><img src="/static/specialist/img/erweima.png" alt="二维码">'
      // })

      // if (!this.askContent) {
      //   this.asking = true
      //   setTimeout(() => {
      //     window['scrollTo'](0, document.getElementById('askAreaText').offsetTop)
      //   }, 200)
      // }

      // this.audioInit()
    },
    beforeDestroy () { // 移除分页事件
      if (this.audioHandler) {
        this.audioHandler.pause()
      }
      this.removeScrollPage()
    },
    methods: {

      reset () {
        this.playMusic(true)
        this.tid = this.$route.query.tid
        this.playing = false
        this.QPage = 1 // 提问列表页码
        this.QpageStop = false
        this.WpageStop = false
        this.WPage = 1 // 方法列表页码
        this.audioItems = []
        this.qItems = []
        this.isInit = false
        this.getDetail()
      },

      getDetail (fn) {
        this.setState(true)
        api.common.getWayDetail(this.apiInterface.topic_detail, {
          tid: this.tid,
          type: 1
        }).then(this.filterCallback)
        .then((res) => {
          this.setState(false)
          this.isSetShare = false
          if (res.errno === 0) {
            this.O = res.rsm.topic_data
            if (this.O.question_num === 0) {
              this.type = 2
            }
            this.setShareData({
              title: this.O.topic_name, // 音频标题
              imgUrl: this.O.avatar_file,
              desc: this.O.topic_description
            })
            this.showObj.currentUrl = this.O.topic_voice_url
            if (this.O.free_question === 0) {
              this.freeing = false
            }
            if (this.audioHandler) {
              this.tochange(this.O.topic_voice_url, this.O.topic_name, this.O.record_time)
            } else { // 初始货
              if (this.askContent) {
                this.asking = true
                setTimeout(() => {
                  window['scrollTo'](0, document.getElementById('askAreaText').offsetTop)
                }, 200)
              }
              this.audioInit()
            }
            if (this.isInit === false) {
              this.getList(1)
              if (this.freeing) {
                this.countDown()
              }
              fn && fn()
            }
            this.isInit = true
          }
        })
      },

      getList (page, type) {
        // if (this.pullLoad) return
        this.setPullLoad(false)
        type = type || this.type
        page = page || (type === 1 ? this.QPage : this.WPage)
        if (type === 1 && this.QpageStop === true || this.listLoading) return
        if (type === 2 && this.WpageStop === true || this.listLoading) return
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.topic_detail_list, {
          tid: this.tid,
          page: page,
          type: type
        }).then(this.filterCallback).then((res) => {
          this.listLoading = false
          if (res.errno === 0) {
            if (this.type === 1) {
              if (this.addItem(this.qItems, res.rsm) === 0 || this.qItems.length < 5) {
                this.QpageStop = true
                this.setPullLoad(false)
              }
              this.QPage = page + 1
            } else {
              if (this.addItem(this.audioItems, res.rsm) === 0 || this.audioItems.length < 5) {
                this.WpageStop = true
                this.setPullLoad(false)
              }
              this.WPage = page + 1
            }
          }
          // this.setPullLoad(false)
        })
      },

      stab (type) {
        this.type = type
        // this.loadPage = false
        this.setPullLoad(false)
        if ((this.type === 1 && this.QPage === 1 && !this.QpageStop) || (this.type === 2 && this.WPage === 1 && !this.WpageStop)) {
          this.getList()
        }
      },
      playMusic (isStop) {
        if (this.audioHandler === '') return
        // if (this.isOpenByWeixin() === false) return
        if (this.playing || isStop) {
          this.audioHandler.pause()
          this.playing = false
        } else {
          if (this.nowTime === '00:00') {
            this.setState(1)
            try {
              window.dataLayer.push({'event': 'gfzjffplay'})
            } catch (e) {}
          }
          this.audioHandler.play()
          this.playing = true
        }
      },
      vtap (evt) {
        if (this.playing === false) return
        let touch = evt
        let pw = document.getElementById('audio-time-bar').offsetWidth
        let progress = Math.floor((touch.pageX / pw) * 100)
        this.playCtrlObj.setProgress(progress)
        this.audioHandler.progress(Math.floor(this.O.record_time * progress / 100))
      },
      tochange (src) {
        this.audioHandler.audio.src = src
        this.nowTime = '00:00'
        this.allTime = this.O.record_time
        // console.log(this.audioHandler, this.audioHandler.list)
        this.allTime = this.O.record_time
        this.audioHandler.list[0] = {
          name: this.O.topic_name,
          url: this.O.topic_voice_url,
          time: this.O.record_time
        }
        this.playCtrlObj.reset()
        this.audioHandler.onEnded()
        // this.audioHandler.reset()
        // this.playMusic()
        // this.audioHandler.play()
      },
      audioInit () {
        let Player = playerFactory('AudioPlayer', window)

        this.audioHandler = new Player({
          id: 'music_player'
        })
        // let self = this
        // this.audioHandler.audio.addEventListener('loadstart', () => {
        //   self.setState(true)
        // }, false)

        // this.audioHandler.audio.addEventListener('canplay', () => {
        //   self.setState(false)
        // }, false)

        this.allTime = this.O.record_time
        this.nowTime = '00:00'
        this.audioHandler.add([{
          name: this.O.topic_name,
          url: this.O.topic_voice_url,
          time: this.O.record_time
        }])

        this.audioHandler.loadIndex(0)
        let pc = new PlayerCtrl({
          'audioArea': 'audio-time-bar',
          'audioRun': 'progress-bar',
          'audioSpot': 'bar-point',
          'audioPlayer': this.audioHandler,
          'data': this.$data
        })

        this.playCtrlObj = pc
        pc.init()
      },

      submitAsk () {
        if (this.isOpenByWeixin('「微信扫一扫，继续下一步」') === false) return
        if (this.askContent === '') {
          this.setPrompt('请填写提问内容！')
          return
        }
        if (this.loading === true) return
        this.setState(true)
        window.localStorage.setItem('askExpertText-' + this.tid, this.askContent)
        api.common.getData(this.apiInterface.add_question, {
          tid: this.tid,
          question: this.askContent,
          is_open: this.is_open
        }).then(this.filterCallback)
        .then((res) => {
          this.setState(false)
          if (res.errno === 0) {
            this.asking = false
            this.O.free_question -= 1
            if (this.O.free_question === 0) {
              this.freeing = false
            } else {
              // this.getDetail()
            }
            this.askContent = ''
            window.localStorage.removeItem('askExpertText-' + this.tid)
            this.addNotice({type: 'success', content: '提问成功'})
            this.type = 1
            this.qItems = []
            this.QPage = 1
            this.QpageStop = false
            this.getList()
          } else if (res.errno === -100) {
            window.localStorage.removeItem('askExpertText-' + this.tid)
            try {
              window.location.href = this.pinjieUrl(res.rsm.pay_link, {
                callback: encodeURIComponent(window.location.href)
              })
            } catch (e) {

            }
          } else {
            window.localStorage.removeItem('askExpertText-' + this.tid)
            this.addNotice({type: 'error', content: '提问失败'})
          }
        })
      },

      countDown () {
        if (this.O.free_time !== '' && this.O.free_time !== 0) {
          this.freeTime = this.secondToTime(--this.O.free_time)
          this.freeing = true
          setTimeout(this.countDown, 1000)
        } else {
          this.freeing = false
        }
      },

      toask () {
        this.asking = true
        setTimeout(() => {
          document.getElementById('askAreaText').focus()
        }, 200)
      },
      follow () {
        if (this.isOpenByWeixin('「微信扫一扫，继续下一步」') === false || this.following === true || this.O.fans_type === 1) return
        this.following = true
        api.common.getData(this.apiInterface.make_follow, {
          uid: this.O.specialist_uid
        })
        .then(this.filterCallback)
        .then((res) => {
          this.following = false
          if (res.errno === 0) {
            this.O.fans_type = 1
            if (this.userinfo.time) { // 重新获取个人数据
              this.userinfo.time = 0
            }
          } else {
            this.addNotice({type: 'error', content: res.err})
          }
        })
      }
    },
    events: {
      playAudio () {
        this.audioHandler.pause()
        this.playing = false
      },
      answerPay (answerid, fn) {
        this.answerPay(answerid, fn)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/detail'
</style>
