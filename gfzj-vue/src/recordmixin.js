export var recordMixins = {
  data () {
    return {
      recording: false,
      startTamp: '',
      recordTimer: null,
      duration: '00:00',
      second: 0,
      recordState: '点击录音',
      maxRecord: 3,
      currentIndex: 0, // 当前播放录音index
      recordIds: [],
      hasRecord: false,
      setTime: null,
      timer: 59000,
      playing: false,
      recordUploading: false,
      hasvoicefile: false
    }
  },

  watch: {
    // 'playing' (nv, ov) {
    //   this.recordState = nv ? '点击停止' : '点击播放'
    // },
    // 'recording' (nv, ov) {
    //   this.recordState = nv ? '停止录音' : '点击播放'
    // }
    // 'weixin' (nv, ov) {
    //   console.log('weixin', nv, ov)
    // }
  },

  methods: {

    getWx () {
      var self = this
      setTimeout(() => {
        if (window['wx']) {
          self.wxplay()
        } else {
          self.getWx()
        }
      }, 100)
    },
    /* ------ 录音功能开始 ---------*/

    init (voice, unupload) {

    },

    reset () {
      this.playing = false
      this.stopPlayRecord()
      this.currentIndex = 0
      this.clearRecord()
      this.duration = '00:00'
      // this.recordState = '点击录音'
      this.hasRecord = false
      this.second = 0
    },

    preview (url) {
      this.previewSrc = url
    },

    record () {
      if (this.initOk === false) {
        return
      }
      // if (this.recording === true) {
      //   this.recordOver()
      //   return
      // }
      // if (this.playing === true) {
      //   this.playing = false
      //   this.stopwxplay()
      //   return
      // }
      // if (this.recordIds.length) {
      // // 播放录音
      //   this.playRecord()
      //   this.playing = true
      //   return
      // }
      // this.recordState = '停止录音'
      this.clearRecord()
      this.startRecord()
    },

    recordDuration () {
      this.startTamp = this.getTime()
      clearInterval(this.recordTimer)
      this.duration = '00:01'
      var maxTime = this.timer * this.maxRecord + 5000
      var twoTime = this.timer * 2 + 3000
      let self = this
      this.recordTimer = setInterval(() => {
        var t = self.getTime() - self.startTamp
        if (t > maxTime) {
          self.setPrompt('抱歉录音出错，请重新录制！')
          self.stopRecordfn()
          self.reset()
          return
        }
        if (t > self.timer + 3000 && self.recordIds.length < 1) {
          self.setPrompt('抱歉录音出错，请重新录制！')
          self.stopRecordfn()
          self.reset()
          return
        }
        if (t > twoTime && self.recordIds.length < 2) {
          self.setPrompt('抱歉录音出错，请重新录制！')
          self.stopRecordfn()
          self.reset()
          return
        }
        if (Math.floor(t / 1000) > 1) {
          var ms = Math.floor(t / 1000)
          var fen = 0
          if (ms > 60) {
            fen = Math.floor(ms / 60)
            ms = ms % 60
          }
          if (ms < 10) {
            ms = '0' + ms
          }
          self.duration = '0' + fen + ':' + ms
        }
        self.second += 1
      }, 1000)
    },

    clearRecord () {
      this.recordIds = []
      if (this.localmp3) {
        this.localmp3 = ''
      }
    },
    startRecord () {
      // this.way.title = 'startRecord'
      this.recording = true
      let self = this
      if (this.recordIds.length < this.maxRecord) {
        window['wx'].startRecord({
          success () {
            if (self.recordIds.length === 0) {
              self.recordDuration()
            }
            self.recording = true
            self.setTime = setTimeout(() => {
              self.stopRecord(true)
            }, self.timer)
          },
          cancel () { // 用户拒绝授权录音
            console.log('用户拒绝授权录音')
            self.recording = false
          },
          fail (res) {
            self.recording = false
            self.addNotice({type: 'error', content: '操作失败，请再尝试！'})
            if (window.location.href.indexOf('dev') > -1) {
              window.alert(JSON.stringify(res))
            }
          }
        })
        // btn_recording.text('').addClass('btn-recording');
        // btn_stop.display(1);
        // btn_comment.display(0)
        // clearTimeout(this.setTime)
      }
    },

    stopRecord (auto) {
      clearTimeout(this.setTime)
      this.setTime = null
      let self = this
      // self.way.title = 'stopRecord'
      if (!auto || this.recordIds.length + 1 === this.maxRecord) {
        clearInterval(this.recordTimer)
      }
      window['wx'].stopRecord({
        complete: function (res) {
          // var localId = res.localId
          // self.recordIds.push(localId)
          // self.way.desc = 'stop-' + self.recordIds.join(' ')
          // // self.way.desc = self.recordIds.length
          // if (auto && self.recordIds.length < self.maxRecord) {
          //   self.startRecord()
          // } else {
          //   self.stopRecordfn()
          // }
          // self.way.title = 'setTime' + self.recordIds.length + localId
          // setTimeout(() => { self.way.desc = self.recordIds.length + '---complete' }, 1000)
        },
        success: function (res) {
          var localId = res.localId
          self.recordIds.push(localId)
          // self.way.desc = 'stop-' + self.recordIds.join(' ')
          // self.way.desc = self.recordIds.length
          if (auto && self.recordIds.length < self.maxRecord) {
            setTimeout(() => { self.startRecord() }, 500)
          } else {
            if (auto && self.recordIds.length === self.maxRecord) {
              self.addNotice({type: 'success', content: '录音完毕！'})
            }
            self.stopRecordfn()
          }
          // self.addNotice({type: 'success', content: '第' + self.recordIds.length + '段录音成功！'})
          // self.way.title = 'setTime' + self.recordIds.length + localId
        },
        fail: () => {
          // self.addNotice({type: 'error', content: '录音'})
          self.reset()
          self.setPrompt('抱歉录音出错，请重新录制！')
          self.stopRecordfn()
        }
      })

      // this.clearTimer = setTimeout(() => {
      //   self.stopRecordfn()
      // }, 500)
    },

    stopRecordfn (e) {
      // this.init('', true)
      // this.recording = false
      // // btn_stop.display(0);
      // if (this.recordIds.length) {
      //   this.hasRecord = true
      //     // btn_comment.display(1);
      // } else {
      //   this.hasRecord = false
      //   // myaudio_parent.display(0)
      // }
      // btn_recording.text('重新录音').removeClass('btn-recording')
      this.recording = false
      // this.recordState = this.recordIds.length ? '点击播放' : '点击录音'
      this.hasRecord = true
      clearInterval(this.recordTimer)
    },

    recordOver () {
      // this.recording = false
      // // this.recordState = this.recordIds.length ? '点击播放' : '点击录音'
      // this.hasRecord = true
      // clearInterval(this.recordTimer)
      this.stopRecord()
    },

    playRecord () {
      this.playing = true
      if (this.hasvoicefile === false) {
        window['wx'].playVoice({
          localId: this.recordIds[this.currentIndex] // 需要播放的音频的本地ID，由stopRecord接口获得
        })
        this.currentIndex++
      } else {
        this.playFileVoice()
      }
    },

    stopPlayRecord () {
      this.playing = false
      if (this.hasvoicefile === false) {
        window['wx'].stopVoice({
          localId: this.recordIds[this.currentIndex - 1] // 需要停止的音频的本地ID，由stopRecord接口获得
        })
        this.currentIndex = 0
      } else {
        this.stopFileVoice()
      }
    }

  }
}
