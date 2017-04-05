<template>
  <div :class="['lists', extcs]">
    <audio :src="currentUrl" class="q-player" id="qlist_{{qlistid}}" ></audio>
    <ul class="" v-el="wrap">
      <li v-for="item in items" class="q-item">
        <div class="ui-avatar fl">
          <img :src="item.avatar_file" alt="alt"/></div>
        <div class="item-content" @click="toreplyed(item)"><strong class="font-pink">{{item.user_name}}</strong>
          <p>{{item.question_name}}</p>
          <div class="q-row" v-if="item.answer_id">
            <div class="ui-avatar fl"><img :src="item.specialist.specialist_avatar_file" alt="alt"/></div>
            <div class="q-audio-wrap">
              <div class="triangle-left"></div>
              <div @click.stop="qplay(item, $index)" :class="['q-audio', playingIndex === $index ? 'q-play' : '']" >
                <span class="q-line-1"></span>
                <span class="q-line-2"></span>
                <span class="q-line-3"></span>
                <time>{{item.record_time}}</time>
                <div class="ui-label ui-label-green" v-if="item.belong === 0">{{item.record_pay||1}}元偷偷听</div>
              </div>
            </div>
          </div>
        </div>
        <div class="font-grey font-sm mt10"><span>{{item.special_cover_url}}</span>
          <div class="fr" v-if="item.heat_num">听过<span class="ml10">{{item.heat_num}}</span></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import { setCid, addNotice } from '../store/actions'
  import store from '../store/store.js'
  export default {
    vuex: {
      getters: {
        componentId: ({ system }) => system.componentId
      },
      actions: {
        setCid,
        addNotice
      }
    },
    store,
    props: {
      'items': {
        type: Array
      },
      'extcs': {
        type: String,
        default: ''
      }
    },
    computed: {

    },
    data () {
      return {
        playing: false,
        currentUrl: '',
        playingIndex: '',
        qlistid: 'qlistAudio',
        listenAudio: false
      }
    },
    ready () {
      this.setCid()
      this.qlistid = this.componentId
    },
    methods: {
      toreplyed (item) {
        if (item.answer_id) {
          this.$route.router.go({path: '/replyed?id=' + item.question_id})
        }
      },
      qplay (item, index) {
        if (this.isOpenByWeixin('「微信扫一扫，继续下一步」') === false) return
        if (item.belong === 0) {
          this.$route.router.go({path: '/replyed?id=' + item.question_id + ' &paying=1'})
          return
        }
        var self = this
        var audio
        if (this.listenAudio === false) {
          audio = document.getElementById('qlist_' + this.qlistid)
          if (audio) {
            audio.addEventListener('ended', () => {
              self.playingIndex = ''
            })
            audio.addEventListener('canplay', () => {
              audio.play()
            })
          }
          this.listenAudio = true
        }
        audio = document.getElementById('qlist_' + this.qlistid)
        audio.pause()
        if (index === this.playingIndex) {
          this.currentUrl = ''
          this.playingIndex = ''
          return
        }
        if (item.currentUrl || item._currentUrl) {
          this.playingIndex = index
          item.currentUrl = item.currentUrl || item._currentUrl
          this.currentUrl = item.currentUrl
          if (/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
            setTimeout(() => { audio.play() }, 500)
          }
          return
        }
        this.playingIndex = ''
        this.$dispatch('answerPay', item.answer_id, (res) => {
          // self.playingIndex = index
          // self.currentUrl = res.answer_url
          // item.currentUrl = self.currentUrl
          if (/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
            item._currentUrl = res.answer_url
            self.addNotice({type: 'success', content: '可以播放，请再次点击'})
            // setTimeout(() => { audio.play() }, 500)
          } else {
            self.playingIndex = index
            self.currentUrl = res.answer_url
            item.currentUrl = self.currentUrl
          }
        })
      },
      showPageErweima (url, msg) {
        url = 'http://qr.liantu.com/api.php?text=' + encodeURIComponent(url || window.location.href)
        msg = msg || '长按图片，保存到相册。'
        this.$dispatch('wxError', {
          wxpopup: true,
          wxpopupText: msg + '<br><img src="' + url + '" alt="二维码">'
        })
      },
      isOpenByWeixin (msg) {
        var ua = navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
        var weixin = false
        if (ua && ua.length && ua[0] === 'micromessenger') {
          weixin = true
        } else {
          this.showPageErweima('', msg)
        }
        return weixin
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/_audio-list.styl'
</style>