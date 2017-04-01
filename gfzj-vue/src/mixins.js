import store from './store/store.js'
import api from './api/api'
import { setState, addNotice, setPrompt, setwxinit, setalbum, setcategory, setuserinfo, setExpertWay, setExpert, setPullLoad } from './store/actions'
export var globalMixins = {
  data () {
    return {
      debug: process.env.NODE_ENV !== 'production',
      backurl: '#',
      nowurl: '#',
      routeName: '',
      lastid: '1',
      isSetShare: false,
      pageShareData: {
        'common': {
          title: '听专家讲家庭教育 — 3分钟解决你的教育难题',
          link: '',
          desc: '听专家讲家庭教育 — 3分钟解决你的教育难题',
          imgUrl: ''
        }
      }
    }
  },

  vuex: {
    getters: {
      apiInterface: ({ system }) => system.apiInterface,
      loading: ({ system }) => system.loading,
      pullLoad: ({ system }) => system.pullloading,
      notices: ({ system }) => system.notices,
      prompt: ({ system }) => system.prompt,
      wxinited: ({ system }) => system.wxinited,
      machineType: ({ system }) => system.machineType,
      album: ({cachedata}) => cachedata.albumList,
      category: ({cachedata}) => cachedata.category,
      userinfo: ({cachedata}) => cachedata.userinfo,
      expertWay: ({cachedata}) => cachedata.expertWay,
      expert: ({cachedata}) => cachedata.expert
    },
    actions: {
      setState,
      addNotice,
      setPrompt,
      setwxinit,
      setalbum,
      setcategory,
      setuserinfo,
      setExpertWay,
      setExpert,
      setPullLoad
    }
  },
  store,

  created () {
    // 切换布局
    var layout = this.$options.layout
    if (layout) {
      this.setLayout(layout)
    }
  },

  route: {
    data (_route) {
      if (_route.from.path) {
        this.backurl = _route.from.path
      }
      this.nowurl = _route.to.path
      this.routeName = this.$options.name
      this.$dispatch('change-route', {to: this.nowurl, from: this.backurl, toname: this.$options.name})
      this.wxsign()
      setTimeout(() => { window['scrollTo'](0, 0) }, 100)
      this.setPullLoad(false)
    }
  },

  watch: {
    'wxinited' (nv, ov) {
      if (nv === true) {
        // console.log('watch-wxinited-share')
        this.share()
      }
    }
  },

  methods: {

    wxsign () {
      // console.log(this.routeName)
      if (this.wxinited === true) {
        // console.log('wxsign-wxinited-share')
        this.share()
      }
      if (this.wxinited !== false) return
      let self = this
      api.common.getWxconfig(this.apiInterface.wxconfig, {url: window.location.href}).then((res) => {
        if (res.data.errno === 0) {
          let rsm = this.toJson(res.data.rsm)
          this.regwx(rsm, {
            debug: false
          }, '', (err) => {
            if (!err && self.wxinited !== 'error') {
              self.setwxinit(true)
              if (window.location.href.indexOf('dev') > -1) {
                self.addNotice({type: 'success', content: '微信注册成功!'})
              }
            } else {
              if (window.location.href.indexOf('dev') > -1) {
                self.addNotice({type: 'error', content: '微信注册失败!'})
              }
              self.setwxinit('error')
            }
          })
        }
      })
    },

    goback () {
      this.route.go()
    },
    // 注：以下方法可以在视图中直接引用，不需要声明，
    // 且会被视图中声明的同名方法覆盖

    /**
     * 检验目标是否为数字类型
     * @param  {Object} value 待检验目标
     * @return {Boolean}
     */
    numberic (value) {
      return /^\d*$/.test(value)
    },

    /**
     * 检验字符串中是否不含空格
     * @param  {String} value 待检验目标字符串
     * @return {Boolean}
     */
    noSpaces (value) {
      return /^\S+$/.test(value)
    },

    /**
     * 检验字符串中是否不以空格开头或结尾
     * @param  {String} value 待检验目标字符串
     * @return {Boolean}
     */
    noSpacesPrefixAndSuffix (value) {
      return /^\S(.*\S)*$/.test(value)
    },

    getTime (st) {
      let t = st ? new Date(st) : new Date()
      return t.getTime()
    },

    getComponentId () {
      return this.lastid++
    },

    toJson (str) {
      try {
        if (typeof str === 'object') return str
        return window['JSON'].parse(str)
      } catch (e) {
        return ''
      }
    },

    toUrlParams (obj) {
      var arr = []
      for (var k in obj) {
        arr.push(k + '=' + obj[k])
      }
      return arr.join('&')
    },

    pinjieUrl (ourl, params) {
      params = this.toUrlParams(params)
      if (ourl.indexOf('?') > -1) {
        return ourl + '&' + params
      } else {
        return ourl + '?' + params
      }
    },

    makeUrl (p) {
      var origin = window.location.origin
      return origin + '/static/specialist/' + p
      // http://t.gaofen.com/static/specialist/img/audio-current-img.png
    },

    handleError (errs) {
      this.setPrompt(errs)
    },

    filterCallback (res) {
      if (res.data.errno === -1) { // 先登录
        window.location.href = this.pinjieUrl(window['Gaofen'].api.do_login, {
          url: window['btoa'](window.location.href)
        })
      } else {
        if (res.data.rsm === null) return res.data
        else return this.toJson(res.data)
      }
    },

    // 把秒数转成时间倒计时
    secondToTime (second) {
      var belift = [] // 结果集
      var minuteTime = 60
      var hourTime = minuteTime * 60
      var dayTime = hourTime * 24
      if (second > dayTime) { // 天数
        var day = Math.floor(second / dayTime)
        second -= day * dayTime
        belift.push(day + '天')
      }
      if (second > hourTime) { // 显示小时
        var hour = Math.floor(second / hourTime)
        if (hour < 10) hour = '0' + hour
        second -= hour * hourTime
        belift.push(hour + ':')
      }
      if (second > minuteTime) {
        var minute = Math.floor(second / minuteTime)
        if (minute < 10) minute = '0' + minute
        second -= minute * minuteTime
        belift.push(minute + ':')
      }
      if (second < 10) second = '0' + second
      belift.push(second)
      return belift.join('')
    },

    regwx (opts, config, initFn, fn) {
      // var self = this
      window['wx'].config({
        debug: config.debug || false,
        appId: opts.appId,
        timestamp: opts.timestamp,
        nonceStr: opts.nonceStr,
        signature: opts.signature,
        jsApiList: [
          'checkJsApi',
          'getLocation',
          'onMenuShareTimeline',
          'onMenuShareQQ',
          'onMenuShareAppMessage',
          'startRecord', // 开始录音接口
          'stopRecord', // 停止录音接口
          'onVoiceRecordEnd', // 监听录音自动停止接口
          'playVoice', // 播放语音接口
          'pauseVoice', // 暂停播放接口
          'stopVoice', // 停止播放接口
          'onVoicePlayEnd', // 监听语音播放完毕接口
          'uploadVoice', // 上传语音接口
          'downloadVoice', // 下载语音接口
          'chooseImage',
          'previewImage',
          'uploadImage'
        ]
      })
      window['wx'].error(function (res) {
        // self.addNotice({type: 'error', content: '微信注册失败'})
        fn && fn(res)
      })
      window['wx'].ready(function () {
        if (initFn) {
          initFn(config)
        }
        // else {
        //   window['wx'].onMenuShareAppMessage(config)
        //   window['wx'].onMenuShareTimeline(config)
        //   window['wx'].onMenuShareQQ(config)
        // }
        fn && fn()
      })
    },
    setShareData (config) {
      if (config.title) {
        this.pageShareData.common.title = config.title
      }
      // if (config.desc) {
      this.pageShareData.common.desc = config.desc || '听专家讲家庭教育 — 3分钟解决你的教育难题'
      // }
      if (config.imgUrl) {
        this.pageShareData.common.imgUrl = config.imgUrl
      }
      if (this.wxinited === true && this.isSetShare === false) {
        this.share()
      }
    },

    share (config) {
      // console.log('config:', config)
      var data = this.pageShareData.common
      data.link = window.location.href
      var canShare = true
      switch (this.routeName) {
        case 'index' :
        case 'catalogs' :
        case 'more' :
        case 'album' :
          data.imgUrl = this.makeUrl('img/audio-current-img.png')
          break
        case 'albumDetail' :
          if (data.imgUrl === '') canShare = false
          // data.title = data.title + ' —— 听' + config.expertName + '个专家方法'
          data.title = data.title + ' — 听专家方法'
          // data.imgUrl = data.imgUrl
          break
        case 'detail' :
          if (data.imgUrl === '') canShare = false
          // data = this.pageShareData.detail
          data.title = data.title + ' — 听专家方法'
          break
        case 'home' :
          if (data.imgUrl === '') canShare = false
          // data = this.pageShareData.detail
          // data.title = data.title + ' —— 听专家方法'
          break
      }
      if (canShare) {
        window['wx'].onMenuShareAppMessage(data)
        window['wx'].onMenuShareTimeline(data)
        window['wx'].onMenuShareQQ(data)
        this.isSetShare = true
      }
    },

    initPage (opt) {
      var self = this
      setTimeout(() => {
        self.getPageCallBack = opt.getPage
        document.addEventListener('scroll', self.bindPage, false)
      }, 100)
    },

    removeScrollPage () {
      document.removeEventListener('scroll', this.bindPage, false)
    },

    getPageCallBack: '',
    getPageTimer: null,

    bindPage () {
      let wh = window.screen.height
      var top = document.documentElement.scrollTop || document.body.scrollTop
      if (top + wh + 20 > document.body.clientHeight) {
        clearTimeout(this.getPageTimer)
        // window['scrollTo'](0, top + 50)
        this.getPageTimer = setTimeout(this.getPageCallBack, 1)
      }
    },

    addItem (olist, data) {
      for (var k = 0; k < data.length; k++) {
        olist.push(data[k])
      }
      return k
    },
    answerPay (answerid, fn) {
      this.setState(true)
      api.common.getData(this.apiInterface.get_voice_link, {
        answer_id: answerid
      }).then(this.filterCallback)
      .then((res) => {
        if (res.errno === 0) {
          fn && fn(res.rsm)
        } else if (res.errno === -100) {
          try {
            var uri = window.location.href.replace('&paying=1', '')
            window.location.href = this.pinjieUrl(res.rsm.pay_link, {
              callback: encodeURIComponent(uri)
            })
          } catch (e) {

          }
        } else {
          this.addNotice({type: 'error', content: res.err})
        }
        this.setState(false)
      })
    },
    getUser (title, imgUrl, fn) {
      var share = function () {
        var shareData = {
          imgUrl: this.user.avatar
        }
        if (this.routeName === 'albumDetail' && title) {
          shareData.title = title
        }
        this.setShareData(shareData)
      }
      if (this.userinfo.time) {
        if ((new Date()).getTime() - this.userinfo.time < 300000) {
          this.user = this.userinfo.user
          share.call(this)
          fn && fn(this.user)
          return
        }
      }
      this.setState(true)
      api.common.getData(this.apiInterface.user_index).then(this.filterCallback).then((res) => {
        this.user = res.rsm
        this.setuserinfo({
          time: (new Date()).getTime(),
          user: this.user
        })
        fn && fn(this.user)
        share.call(this)
        this.setState(false)
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
