<template>
  <div :class="['wrap',bodycs]">
    <header class="header" v-if="bodycs === 'form-page'">
      <template v-if="toname === 'publish'">
        <h1>方法发布</h1>
      </template>
      <template v-if="toname === 'reply'">
        <h1>问答回复</h1>
        <a href="#" @click.prevent="showPageErweima()" class="icon icon-share"></a>
      </template>
    </header>
    <header class="header" v-if="bodycs === 'news-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>专家</h1>
    </header>
    <header class="header" v-if="bodycs === 'albumDetail-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>专辑详情</h1>
    </header>
    <header class="header" v-if="bodycs === 'catalogs-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>分类内容</h1>
    </header>
    <header class="header" v-if="bodycs === 'follow-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>关注者</h1>
    </header>
    <header class="header" v-if="bodycs === 'friends-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>关注了</h1>
    </header>
    <header class="header" v-if="bodycs === 'cash-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>收入提现</h1>
    </header>
    <header class="header" v-if="bodycs === 'erweima-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>二维码</h1>
    </header>
    <header class="header" v-if="bodycs === 'login-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
    </header>
    <header class="header" v-if="bodycs === 'edit-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>编辑</h1>
    </header>
    <header class="header"  v-if="bodycs === 'index-page'">
      <h1><img src="assets/img/title.png" alt="title"></h1>
    </header>
    <header class="header"  v-if="bodycs === 'home-page'">
      <h1>个人中心</h1>
    </header>
    <header class="header"  v-if="bodycs === 'album-page'">
      <h1>编辑推荐</h1>
    </header>
    <header class="header"  v-if="bodycs === 'newssetting-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1>消息提醒</h1>
    </header>
    <header class="header"  v-if="bodycs === 'detail-page'">
      <a href="" @click.prevent="goback()" class="icon icon-return"></a>
      <h1><img src="assets/img/title.png" alt="title"></h1>
      <a href="#" @click.prevent="showPageErweima()" class="icon icon-share"></a>
    </header>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>

    <nav id="nav-menu" class="nav-menu">
      <a title="热门" class="nav-hot" v-link="{path:'/index'}">
        <i class="icon icon-hot"></i><span>热门</span>
      </a>
      <a title="专辑" class="nav-album" v-link="{path:'/album'}">
        <i class="icon icon-album"></i><span>专辑</span>
      </a>
      <a title="我的" class="nav-home" v-link="{path:myhome}">
        <i class="icon icon-home"></i><span>我的</span>
      </a>
    </nav>

    <div class="loading-fixed" v-show="loading">
      <div class="icon-loading">
        <div class="dot dot1">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot2">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot3">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot4">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
      </div>
      <!-- <p>加载中...</p> -->
    </div>

    <toast :messages="notices"></toast>

    <popup :show="!!prompt" :message="prompt" @popupclose="closePopup()">
      <div slot="body">
        {{prompt}}
      </div>
    </popup>

    <popup :show="wxpopup"  @popupclose="closewxPopup()">
      <div slot="body">
        <div class="pupup-erweima">
          {{{wxpopupText}}}
        </div>
      </div>
    </popup>


    <div class="loading-pull" v-show="pullLoad">
      <div class="icon-loading">
        <div class="dot dot1">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot2">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot3">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
        <div class="dot dot4">
          <i class="dot-t"></i>
          <i class="dot-b"></i>
        </div>
      </div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
  import { setState, getInterface, setPrompt, addNotice, setmachineType } from './store/actions'
  import store from './store/store.js'
  import toast from './components/Toast'
  import popup from './components/Popup'
  // import api from './api/api'
  export default {
    vuex: {
      getters: {
        loading: ({ system }) => system.loading,
        pullLoad: ({ system }) => system.pullloading,
        notices: ({ system }) => system.notices,
        prompt: ({ system }) => system.prompt,
        machineType: ({ system }) => system.machineType
      },
      actions: {
        setState,
        getInterface,
        addNotice,
        setPrompt,
        setmachineType
      }
    },
    store,
    components: {
      toast,
      popup
    },
    data () {
      return {
        // notices: [],
        toname: '',
        nowurl: this.$route.path,
        fromurl: '#',
        wxpopup: false,
        wxpopupText: '暂时不能录音，请扫描二维码进入再尝试',
        myhome: '/home'
      }
    },
    computed: {

      bodycs () {
        let cs = ''
        if (this.toname === 'publish' || this.toname === 'reply') {
          cs = 'form-page'
        } else {
          cs = this.toname + '-page'
        }
        return cs
      }

    },
    name: 'App',
    ready () {
      if (window['Gaofen']) {
        this.getInterface(window['Gaofen']['api'])
      }
      this.$on('change-route', (urlobj) => {
        // console.log(urlobj)
        this.nowurl = urlobj.to
        this.fromurl = urlobj.from
        this.toname = urlobj.toname
      })
      if (/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
        this.setmachineType('ios')
      }

      this.$on('wxError', (obj) => {
        this.wxpopup = obj.wxpopup
        this.wxpopupText = obj.wxpopupText
      })
      this.isWeixin()
    },

    methods: {
      closePopup () {
        this.setPrompt('')
      },
      closewxPopup () {
        this.wxpopup = false
      },
      goback () {
        window['history'].go(-1)
      },
      showPageErweima (url) {
        url = 'http://qr.liantu.com/api.php?text=' + encodeURIComponent(url || window.location.href)
        this.$dispatch('wxError', {
          wxpopup: true,
          wxpopupText: '长按图片，保存到相册。<br><img src="' + url + '" alt="二维码">'
        })
      },
      isWeixin () {
        var ua = navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
        if (ua && ua.length && ua[0] === 'micromessenger') {
          this.myhome = '/home'
        } else {
          this.myhome = '/login'
        }
      }
    }
  }
</script>

<style lang="stylus">
  // 配置
  @import 'assets/stylus/base'

  .page-container
    size 100%
    background #fff

  .view
    transition transform .25s ease-in-out, opacity .25s ease-in-out
  .view-enter
  .view-leave
    opacity 0
    transform translate3d(10px, 0, 0)

  .pupup-erweima
    width:100%;text-align:center
    img
      width 100px
      height 100px
</style>
