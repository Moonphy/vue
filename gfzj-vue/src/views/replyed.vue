<template>
  <div class="replyed-page">
    <div class="bg-white pb10">
      <audio :src="currentUrl" class="q-player" id="reply_1" ></audio>
      <div class="q-item borer-b album-item" v-if="question.user_name">
        <div class="ui-avatar fl">
          <img :src="question.avatar_file" alt="alt">
        </div>
        <div class="item-content">
          <strong class="font-pink">{{question.user_name}}</strong>
          <p>{{question.question_name}}</p>
          <div class="q-row">
            <div class="ui-avatar fl">
              <img :src="question.specialist_avatar_file" alt=""/>
            </div>
            <div class="q-audio-wrap">
              <div class="triangle-left"></div>
              <div @click="pay()" :class="['q-audio', playing?'q-play':'']">
                <span class="q-line-1"></span>
                <span class="q-line-2"></span>
                <span class="q-line-3"></span>
                <time>{{question.record_time}}"</time>
                <div class="ui-label ui-label-green" v-if="question.belong === 0">1元偷偷听</div>
              </div>
            </div>
          </div>
        </div>
        <div class="font-grey font-sm mt10">
          <div class="mt5 mb5">
            <span>{{question.heat_num}}人听过</span> | <span>{{question.add_time | timestampToday}}</span>
          </div>
          <div>
            <span>来自</span><span class="font-pink">《{{question.topic_name}}》</span>
          </div>
        </div>
      </div>

      <div class="author-wrap border-r"  v-if="question.specialist_name">
        <div class="clearfix">
          <div class="fl">
            <div class="ui-avatar"><img :src="question.specialist_avatar_file" alt=""></div>
            <div class="icon-fav" v-if="question.fans_type===0" @click="follow()">关注</div>
            <div class="icon-fav had-fav" v-if="question.fans_type===1">已关注</div>
          </div>
          <div class="author-detail">
            <strong class="mr10">{{question.specialist_name}}</strong>
<!--             <span v-if="question.specialist_signature" class="ui-label ui-label-pink">{{question.specialist_signature | cutString 10}}</span> -->
            <p>{{question.specialist_signature}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="audio-list"  v-if="question.list_data">
      <div class="list-title">
        <span class="font-pink ml20">值得一听</span>
      </div>
      <List :items="question.list_data"  :show-obj="showObj" :show-expert="false" class="opacitycs" transition="opacitycs"></List>
      <template v-if="question.list_data.length === 0 && question.question_name !== ''">
        <div class="list">
          <ul> <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> </ul>
        </div>
      </template>
    </div>
  </div>

</template>
<script >
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  import List from '../components/List.vue'
  export default {
    name: 'replyed',
    mixins: [globalMixins],
    components: {
      List
    },
    data () {
      return {
        voiceAudio: '',
        qid: '',
        currentUrl: '',
        playing: false,
        audioItems: [],
        following: false,
        showObj: {
          currentUrl: ''
        },
        question: {
          question_id: '',
          user_name: '',
          question_name: ''
        }
      }
    },
    ready () {
      this.qid = this.$route.query.id
      if (!this.qid) {
        this.$route.router.go({path: '/index'})
        return
      }
      // this.setState(true)
      this.getData()
    },
    methods: {
      getData () {
        // this.question = {
        //   'question_id': 151,
        //   'question_name': 'eeeee',
        //   'uid': 1595,
        //   'topic_id': 44,
        //   'specialist_uid': 1593,
        //   'add_time': 1474602315,
        //   'answer_id': 25,
        //   'fans_type': 0,
        //   'order_id': 0,
        //   'fee': 0,
        //   'parent_id': 0,
        //   'is_open': 1,
        //   'is_free': 0,
        //   'topic_name': '\u6d4b\u8bd5\u5f55\u97f3',
        //   specialist_name: '咫尺',
        //   list_data: [{
        //     add_time: 1472010444,
        //     question_num: 0,
        //     specialist_name: '咫尺',
        //     specialist_uid: 1571,
        //     topic_cover_url: 'http://dev.i.gaofen.com/uploadshttp:/113.com',
        //     topic_cover_url_small: 'http://dev.i.gaofen.com/uploadshttp:/small_113.com',
        //     topic_id: 3,
        //     topic_name: '专题3',
        //     topic_voice_url: 'http://dev.i.gaofen.com/uploads/voic/llsds3.mp3',
        //     update_time: 1472010444}],
        //   'question_fee': 1,
        //   'heat_num': 0,
        //   'praise_num': 0,
        //   'answer_time': 1474602440,
        //   'record_time': 2,
        //   'order_uid': 1595,
        //   'order_type': 0,
        //   'user_name': '\u53ca\u65f6\u96e8',
        //   'avatar_file': '',
        //   'specialist_avatar_file': ''
        // }
        // console.log(api)
        this.setPullLoad(true)
        api.common.getData(this.apiInterface.question_detail, {
          qid: this.qid
        }).then(this.filterCallback).then((res) => {
          this.setPullLoad(false)
          if (res.errno === 0) {
            this.question = res.rsm
            if (this.$route.query.paying === '1') { // 收听支付
              this.pay()
            }
            if (this.question.specialist_name) { // 有回复时才输出回复的分享内容
              this.setShareData({
                title: this.question.specialist_name + '回复了' + this.question.topic_name,
                desc: '高分专家 | 听专家讲家庭教育',
                imgUrl: this.question.specialist_avatar_file
              })
            }
          }
        })
      },
      pay () {
        if (this.isOpenByWeixin('「微信扫一扫，继续下一步」') === false) return
        var self = this
        if (this.voiceAudio === '') {
          this.voiceAudio = document.getElementById('reply_1')

          this.voiceAudio.addEventListener('ended', () => {
            self.playing = false
          })

          this.voiceAudio.addEventListener('canplay', () => {
            self.setState(false)
            self.voiceAudio.play()
          })
        }
        this.voiceAudio.pause()
        if (this.playing) {
          this.playing = false
          return
        }
        if (this.currentUrl) {
          this.playing = true
          setTimeout(() => { self.voiceAudio.play() }, 100)
          return
        }
        // self.audioss = self.voiceAudio ? '----' : ''
        this.playing = false
        this.setState(true)
        this.answerPay(this.question.answer_id, (res) => {
          self.currentUrl = res.answer_url
          if (self.machineType !== 'andriod') {
        // self.currentUrl = 'http://i.dev.gaofen.com/uploads/specialist/voice/20160923/4c7be528d4393ab50110e030c68ff55d.mp3'
            self.question.heat_num = self.question.heat_num + 1
            setTimeout(() => {
              self.playing = true
              self.setState(false)
              self.voiceAudio.play()
              // self.audioss = self.voiceAudio ? '--ssss--' : ''
            }, 500)
          }
        })
      },
      follow () {
        if (this.isOpenByWeixin('「微信扫一扫，继续下一步」') === false || this.following === true || this.question.fans_type === 1) return
        this.following = true
        api.common.getData(this.apiInterface.make_follow, {
          uid: this.question.specialist_uid
        })
        .then(this.filterCallback)
        .then((res) => {
          this.following = false
          if (res.errno === 0) {
            this.question.fans_type = 1
          } else {
            this.addNotice({type: 'error', content: res.err})
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/_audio-list'
  // 作者
  .author-wrap
    padding: .5rem .2rem .3rem .2rem;
    background-color: #ffffff;
    overflow: hidden;
  .icon-fav
    background-color #5aacff
    color #ffffff
    line-height .26rem
    text-align center
    border-radius .04rem
    &:active
      box-shadow: inset 0 0.02rem 0.03rem rgba(0,0,0,0.3);
  .had-fav
    background-color: #d1d1d1;

  .author-detail
    margin: 0 0 0 .7rem;
    p
      color: #b3b3b3;
      margin: .05rem 0;
      font-size: .14rem;
      line-height 1.5
      max-height .6rem
      overflow hidden
    strong
      font-size .16rem
      color #ff907b
      vertical-align middle

  .clearfix
    &:before
    &:after
      display table
      content ""
      line-height 0
    &:after
      clear both
  
</style>
