<template>
  <div class="form bg-white">
    <audio id="file_voice" autoplay></audio>
      <form>
<!--           <div class="form-row">
            <div class="list-item">
              <span class="ui-label label-catalog"><i class="icon icon-catalog-7"></i>生活指导</span>
              <p>为什么孩子不爱读书，家长怎么办？</p>
            </div>
          </div> -->
          <div class="form-row">
              <label class="font-pink">方法标题</label>
              <div class="list-item">
                <span v-if="way.category_id" class="ui-label label-catalog"><i class="icon icon-catalog-{{way.category_id}}"></i>{{category_name}}</span>
                <input placeholder="标题" type="text" v-model="way.title" readonly="{{titlechoosed}}">
              </div>
          </div>
          <div class="form-row">
              <label class="font-pink">方法介绍</label>
              <textarea @keydown="keydown($event)"  @input="descinput($event)" @keyup="keyup($event)" placeholder="这里可以补充描述你的解答思路、问题背景..." type="text" rows="3" v-model="way.desc"></textarea>
              <div class="font-grey font-sm fr">还可以输入<span :class="[maxDesc === 0 ? 'font-red': '']">{{maxDesc}}</span>个字</div>
          </div>
          <div class="form-row">
              <label class="font-pink">方法封面</label>
              <div class="input-row tc">
                  <div class="ui-avatar" v-show="previewSrc">
                    <img :src="previewSrc" alt="avatar">
                  </div>
                  <div class="ui-avatar ui-avatar-c" v-show="previewSrc">
                    <div class="ui-over">
                      <img :src="previewSrc" alt="avatar" id="preview">
                    </div>
                  </div>
                  <a class="btn btn-primary btn-block"><input type="file" id="uploadface">{{uploadFace_text}}</a>
                  <div class="font-grey font-sm">不上传封面图发布后，运营人员可进行修改</div>
              </div>
          </div>
          <div class="form-row">
              <label class="font-pink">方法音频<span class="font-grey font-sm">（录音限制 3 分钟）</span></label>
              <div class="input-row tc">
                  <div :class="['btn-wrap-s', (hasRecord || hasvoicefile)?'':'hidden']"  @click.prevent="reset()">
                    <a class="btn btn-reset"></a>
                      <div class="font-grey">重置</div>
                  </div>
                  <div class="btn-wrap">
                    <a class="btn btn-start" v-if="(!hasRecord && !recording && !hasvoicefile )" @click.prevent="record()">
                      <p class="font-pink">点击录音</p>
                    </a>
                    <a class="btn btn-stop" v-if="recording"  @click.prevent="recordOver()">
                      <p class="font-pink">停止录音</p>
                    </a>
                    <a class="btn btn-play" v-if="(hasRecord && !recording && !playing) || (hasvoicefile && !playing)" @click.prevent="playRecord()">
                      <p class="font-pink">播放录音</p>
                    </a>
                    <a class="btn btn-stop" v-if="playing" @click.prevent="stopPlayRecord()">
                      <p class="font-pink">停止播放</p>
                    </a>
                    <div class="font-grey">{{duration}}</div>
                  </div>
                  <div :class="['btn-wrap-s', (machineType !== 'ios' && !hasvoicefile) ?'':'hidden']">
                    <a class="btn btn-upload">
                      <input type="file" id="chooseMP3">
                    </a>
                    <div class="font-grey" @click="uploadfile()">上传本地音频</div>
                  </div>
                  <a @click.prevent="uploadRecord()" class="btn btn-block btn-primary" :class="[hasRecord && way.voice === ''?'':'hidden']">{{uploadText}}</a>
              </div>
          </div>
          <div class="form-row">
              <label class="font-pink">提问费用设置</label>
              <div class="input-row pl15 pr15">
                  <div class="row-flex">
                      <div @click="chooseMoney(1)" class="pay-set" :class="[way.money===1?'selected':'']">1元</div>
                      <div @click="chooseMoney(5)" class="pay-set" :class="[way.money===5?'selected':'']">5元</div>
                  </div>
                  <div class="row-flex">
                      <div class="pay-set" @click="chooseMoney(10)" :class="[way.money===10?'selected':'']">10元</div>
                      <input type="number" @click="chooseMoney('')" placeholder="自定义" class="pay-set" v-model="way.othermoney"  :class="[way.othermoney?'selected':'']">
                  </div>
                  <div class="font-grey font-sm">"自定义"选项请填写1-100元整数</div>
              </div>
          </div>
      </form>
      <div class="tc pl20 pr20 pb40">
          <input type="button" value="发布方法" class="btn btn-primary btn-block" @click.prevent="publishWay()">
      </div>
  </div>
</template>
<script >
  import { globalMixins } from 'src/mixins.js'
  import { recordMixins } from 'src/recordmixin.js'
  import UploadCtrl from '../plugin/upload/upload.js'
  import api from '../api/api'
  export default {
    name: 'publish',
    mixins: [globalMixins, recordMixins],
    data () {
      return {
        way: {
          title: '',
          desc: '',
          money: '',
          realMoney: '',
          faceimg: '',
          voice: '',
          category_id: '',
          othermoney: ''
        },
        category_name: '',
        titlechoosed: false,
        full_path: '',
        initOk: false,
        publishing: false,
        wxconfig: '',
        localmp3: '',
        maxDesc: 60,
        uploadList: [],
        serverIds: [],
        // 以下为上传封面属性
        upladObj: '',
        previewSrc: '',
        testPlay: '',
        uploadFace_text: '选择封面图',
        uploadText: '提交上传'
      }
    },

    computed: {
      'uploadFace_text' () {
        return this.previewSrc !== '' ? '重新选择封面' : '选择封面图'
      }
    },

    ready () {
      let titleobj = window.localStorage.getItem('publish-titleobj') || ''
      if (titleobj) {
        try {
          titleobj = window.JSON.parse(titleobj)
          this.way.title = titleobj.tips_name
          this.category_name = titleobj.category_name
          this.way.category_id = titleobj.category_id
        } catch (e) {
          this.$route.router.go({path: '/titlelist'})
          return
        }
        window.localStorage.removeItem('publish-titleobj')
        this.titlechoosed = !!this.way.title
      } else {
        this.$route.router.go({path: '/titlelist'})
        return
      }
      this.upladObj = new UploadCtrl({
        id: 'uploadface',
        pid: 'preview',
        autoUpload: true,
        onSuccess: this.uploadImgSuccess,
        showTip: this.showTips,
        uploadReady: this.uploadReady,
        onFailure: this.onFailure,
        fileObject: 'facefile',
        maxSize: 4096000,
        url: this.apiInterface.do_upload + '?' + this.toUrlParams({
          id: 'cover',
          field: 'facefile'
        }),
        previewfn: this.preview
      })

      this.getWx()

      this.selectFile()

      document.getElementById('file_voice').addEventListener('ended', this.fileVioceEnd, false)
      // this.hasvoicefile = true
      // this.full_path = 'http://dev.phpmvc.com/5.mp3'
      // document.getElementById('chooseMP3').addEventListener('change', this.selectFile, false)
    },
    methods: {
      getLen (text) {
        var len = text.length
        var matcher = text.match(/[^\x00-\xff]/g)
        if (matcher) {
          len += matcher.length
        }
        return len
      },
      wxplay () {
        if (this.wxinited === 'error') {
          // this.handleError('录音功能不正常，请重新打开！')
          this.$dispatch('wxError', {
            wxpopup: true,
            wxpopupText: '录音不能正常工作，请扫描进入。<br><img src="/static/specialist/img/erweima.png" alt="二维码">'
          })
        }
        var self = this
        this.initOk = true
        window['wx'].onVoicePlayEnd({
          success: function (res) {
            if (self.currentIndex < self.recordIds.length) {
              setTimeout(() => { self.playRecord() }, 0)
            } else {
              self.playing = false
              setTimeout(() => {
                self.currentIndex = 0
              }, 2000)
            }
          }
        })
        window['wx'].onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            // self.way.title = 'autoStop'
            var localId = res.localId
            self.recordIds.push(localId)
            self.stopRecordfn()
          }
        })
      },

      uploadRecord () {
        if (this.recordUploading === true) {
          return
        }
        // this.way.title = this.recordIds.length
        if (this.recordIds.length === 0 && this.localmp3 === '') return
        // this.way.title = '2'
        this.uploadList = []
        this.serverIds = []
        for (var i = 0; i < this.recordIds.length; i++) {
          this.uploadList.push(this.recordIds[i])
        }
        this.setState(true)
        this.uploadServer()
      },

      uploadServer () {
        if (this.recordUploading) return
        this.recordUploading = true
        // this.way.title = '3'
        if (this.uploadList.length === 0) {
          if (this.serverIds.length) {
            // this.way.title = this.serverIds
            // this.setState(true)
            api.common.uploadWeixinServerid(this.apiInterface.do_upload + '?' +
              this.toUrlParams({
                id: 'voice',
                field: 'voicefile',
                media_id: this.serverIds.join(',')
              }), {}).then((res) => {
                this.setState(false)
                if (res.data.errno === 0) {
                  this.addNotice({type: 'success', content: '录音提交成功！'})
                  // this.uploadText = '再次上传'
                  this.way.voice = res.data.rsm.path
                  this.recordUploading = false
                } else {
                  this.recordUploading = false
                }
              }).catch((e) => {
                this.recordUploading = false
                this.setState(false)
              })

            // this.ways.serverIds = this.serverIds.join(',')
          }
          return
        }
        var ls = this.uploadList.shift()
        var self = this
        window['wx'].uploadVoice({
          localId: ls, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 0, // 默认为1，显示进度提示
          success: function (res) {
            self.serverIds.push(res.serverId)
            self.recordUploading = false
            self.uploadServer()
          }
        })
      },
      // 重置录音
      reset () {
        if (this.hasvoicefile) {
          this.stopFileVoice()
        }
        this.playing = false
        this.stopPlayRecord()
        this.currentIndex = 0
        this.clearRecord()
        this.duration = '00:00'
        this.recordState = '点击录音'
        this.hasRecord = false
        this.serverIds = []
        this.way.voice = ''
        this.full_path = ''
        this.hasvoicefile = false
        this.second = 0
        // this.way.media_id = ''
        this.uploadText = '提交上传'
      },

      chooseMoney (m) {
        if (m === '') {
          this.way.money = ''
        } else {
          this.way.money = m
          this.way.othermoney = ''
        }
      },

      showTips (msg) {
        // this.handleError(msg)
        this.addNotice({type: 'error', content: msg})
        this.setState(false)
      },

      // 图片上传成功
      uploadImgSuccess (orgFile, rsm) {
        this.setState(false)
        this.addNotice({type: 'success', content: '成功上传封面！'})
        this.way.faceimg = rsm.path
      },

      uploadReady () {
        this.setState(true)
      },

      onFailure (text) {
        this.showTips('上传失败')
        this.setState(false)
      },

      selectFile () {
        this.uploadfile = new UploadCtrl({
          id: 'chooseMP3',
          autoUpload: true,
          onSuccess: this.uploadFileSuccess,
          showTip: this.showTips,
          uploadReady: this.uploadReady,
          onFailure: this.onFailure,
          fileObject: 'voicefile',
          maxSize: 10240000,
          url: this.apiInterface.do_upload + '?' + this.toUrlParams({
            id: 'voice',
            field: 'voicefile'
          })
        })
      },

      uploadFileSuccess (orgFile, rsm) {
        this.setState(false)
        this.addNotice({type: 'success', content: '成功上传录音！'})
        this.way.voice = rsm.path
        this.full_path = rsm.full_path
        this.hasvoicefile = true
        this.getVoiceTime()
        document.getElementById('chooseMP3').value = ''
        // this.way.faceimg = rsm.path
      },

      getVoiceTime () {
        // console.log('getVoiceTime')
        let mp = document.createElement('audio')
        var self = this
        mp.addEventListener('canplay', () => {
          var ms = Math.floor(mp.duration)
          var fen = 0
          if (ms > 60) {
            fen = Math.floor(ms / 60)
            ms = ms % 60
          }
          if (ms < 10) {
            ms = '0' + ms
          }
          // console.log('0' + fen + ':' + ms)
          self.duration = '0' + fen + ':' + ms
        })
        mp.src = this.full_path
      },

      playFileVoice () {
        document.getElementById('file_voice').src = this.full_path
      },

      stopFileVoice () {
        document.getElementById('file_voice').pause()
        document.getElementById('file_voice').src = ''
      },

      fileVioceEnd () {
        this.playing = false
      },

      cutSrt (text) {
        // 所有宽字用&&代替
        var c = text.replace(/&/g, ' ')
             .replace(/[^\x00-\xff]/g, '&&')
        // c.slice(0, length)返回截短字符串位
        text = text.slice(0, c.slice(0, 120)
            // 由位宽转为JS char宽
          .replace(/&&/g, ' ')
          // 除去截了半个的宽位
          .replace(/&/g, '').length
        )
        return text
      },

      keyup (evt) {
        var text = this.way.desc
        var len = this.getLen(text)
        if (len > 120) {
          text = this.cutSrt(text)
          this.way.desc = text
          this.maxDesc = 0
        }
      },
      descinput (evt) {
        var text = this.way.desc
        var len = this.getLen(text)
        if (len > 120) {
          text = this.cutSrt(text)
          this.way.desc = text
        }
        if (len >= 120 && evt.keyCode !== 8) {
          this.maxDesc = 0
          evt.preventDefault()
        } else {
          this.maxDesc = Math.floor((120 - len) / 2)
        }
      },
      keydown (evt) {
        var text = this.way.desc
        var len = this.getLen(text)
        if (len > 120) {
          text = this.cutSrt(text)
          this.way.desc = text
          this.maxDesc = 0
          evt.preventDefault()
        }
      },

      publishWay () {
        if (this.way.title === '') {
          this.showTips('请填写方法标题')
          return
        }

        if (this.way.voice === '') {
          this.showTips('请提交方法录音')
          return
        }

        if (this.way.money === '' && this.way.othermoney === '') {
          this.showTips('请设置提问费用')
          return
        }
        this.setState(true)
        var sendData = {
          title: this.way.title,
          desc: this.way.desc,
          realMoney: this.way.money || this.way.othermoney,
          voice: this.way.voice,
          record_time: this.second,
          category_id: this.way.category_id,
          faceimg: this.way.faceimg
        }
        api.common.publishWay(this.apiInterface.topic_publish, sendData).then((res) => {
          if (res.data.errno === 0) {
            this.$route.router.go({path: '/detail?tid=' + res.data.rsm.topic_id})
          } else {
            this.showTips(res.data.err)
          }
          this.setState(false)
          api.common.getData(this.apiInterface.report, {
            data: JSON.stringify(sendData),
            request: JSON.stringify({
              requestUrl: window['location'].href,
              result: res,
              status: 0
            })
          })
        }).catch(() => {
          api.common.getData(this.apiInterface.report, {
            data: JSON.stringify(sendData),
            request: JSON.stringify({
              requestUrl: window['location'].href,
              result: 'catch error',
              status: 0
            })
          })
          this.showTips('server error')
          this.setState(false)
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/publish'
  .font-red
    color red
  .list-item
    border-bottom .01rem solid #e5e5e5
    color #707070
    padding-top .07rem

</style>
