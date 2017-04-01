<template>
  <div class="expert-index">
<!--     <header>
      <img src="../assets/images/top.png">
    </header> -->
    <div class="header">
      <div class="header-img">
        <a class="fl return-icon" herf="#" v-link="{path:backurl}">
          <div class="left-icon"></div>
        </a>
      </div>
    </div>
    <div class="main">
      <div class="back-img"></div>
      <div class="circle-bak org-bak">
        <img src="../assets/images/music-circle-bak3.png">
      </div>
      <div  :class="['circle-bak black-bak', playing ? 'music_play' : '']">
        <img src="../assets/images/music-circle.png">
      </div>
      <div class="circle-bak play-circle">
        <img src="../assets/images/play-circle.png">
      </div>
      <div class="circle-bak play-play" v-tap="playMusic()">
        <audio src="" id="music_player"></audio>
        <img src="../assets/images/play.png" :class="[playing ? 'hidden' : '']" />
        <img src="../assets/images/pause.png" :class="[playing ? '' : 'hidden']" />
      </div>
    </div>
    <div class="audio-cont">
      <div class="audio-title">
        孩子不爱学习家长不督促就不动
      </div>
      <div class="audio-desc">
        孩子不爱学习家长不督促就不动,孩子不爱学习家长不督促就不动孩子不爱学习家长不督促就不动孩子不爱学习家长不督促就不动孩子不爱学习家长不督促就不动
      </div>
      <div class="audio-time-ctrl" v-tap="vtap($event)">
        <div class="audio-time clearfix">
          <div class="audio-currtime fl">{{nowTime}}</div>
          <div class="audio-alltime fr">{{allTime}}</div>
        </div>
        <div class="audioline">
          <div class="audio-line" id="audioLine">
            <div class="audio-curr-line" id="audioRun"></div>
            <div class="audio-line-spot" id="audioSpot"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="audio-cont">
<!--       <div v-tap="tochange('http://dev.phpmvc.com/audioPlayer/example/music/sun.mp3')">change music</div>
      <a v-link="{path:'/expert'}">expert</a> -->
      <div class="item clearfix">
        <div class="fl item-left">
          <div class="item-head">
            <img src="../assets/images/expertheader1.png">
          </div>
          <div class="btn">关注</div>
        </div>
        <div class="fr item-right">
          <div class="item-title">
            <span class="expert-name">曾老师</span>
            <span class="expert-academic">中国科学院院士</span>
          </div>
          <div class="item-cont">
            孩子不爱学习家长不督促就不动,孩子不爱学习家长不督促就不动孩子不爱学习家长不督促就不动孩子不爱学习...
          </div>
        </div>
      </div>
      <div class="shengyu">
        <div class="fl">
          <img src="../assets/images/anwser.png" />
        </div>
        <div class="fl sheng-text">
          <div>剩余时间：12:12:11</div>
          <div>剩余条数：14</div>
        </div>
      </div>
      <div class="shengyu-tips">
        <span class="tick"></span>
        <span class="tick-text">公开答案，享受分成</span>
      </div>
    </div>
  </div>
</template>

<script>
  import playerFactory from '../plugin/player/factory.js'
  import PlayerCtrl from '../plugin/player/player.ctrl.js'
  import { globalMixins } from 'src/mixins.js'
  export default {
    name: 'LoginForm',
    mixins: [globalMixins],
    data () {
      return {
        audioHandler: '',
        playing: false,
        playCtrlObj: '',
        nowTime: '--:--',
        allTime: '--:--'
      }
    },
    ready () {
      this.$emit('audioInit')
      // this.$route.router.go({path: '/expert'})
    },
    methods: {
      playMusic () {
        if (this.playing) {
          this.audioHandler.pause()
          this.playing = false
        } else {
          this.audioHandler.play()
          this.playing = true
        }
      },
      vtap (evt) {
        let touch = evt[0].changedTouches[0]
        this.playing = true
        this.playCtrlObj.run(touch.pageX)
      },
      tochange (src) {
        this.audioHandler.audio.src = src
        this.audioHandler.reset()
        this.playCtrlObj.reset()
        this.audioHandler.play()
      }
    },
    events: {
      audioInit () {
        let Player = playerFactory('AudioPlayer', window)

        this.audioHandler = new Player({
          id: 'music_player'
        })

        this.audioHandler.add([{
          name: 'Tobu,Itro - Sunburst',
          url: 'http://dev.phpmvc.com/audioPlayer/example/music/Heroes.mp3',
          time: '03:08'
        }])

        this.audioHandler.loadIndex(0)

        let pc = new PlayerCtrl({
          'audioArea': 'audioLine',
          'audioRun': 'audioRun',
          'audioSpot': 'audioSpot',
          'audioPlayer': this.audioHandler,
          'data': this.$data
        })

        this.playCtrlObj = pc
        pc.init()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../assets/stylus/settings'
  @import '../assets/stylus/common'

  _transition()
    -webkit-transition arguments[0] arguments[1]
    -moz-transition arguments[0] arguments[1]
    -o-transition arguments[0] arguments[1]
    transition arguments[0] arguments[1]

  .expert-index
    position relative
    background #fff
  .main
    min-height 200px
    position relative
    //background #404040
    .back-img
      background url('../assets/images/index-white-bak.png') no-repeat 
      background-size 100% 100%
      width 100%
      min-height 500px
      margin-top -40px
      position absolute
    .circle-bak
      text-align center
      position absolute
      width 100%
      top -27px
    .org-bak
      img
        width 228px
        height 220px
    .black-bak
      top -13px
      img
        width 185px
        height 185px
    .music_play
      img
        transform translate3d(0,0,0)
        -webkit-animation change 1.5s linear infinite
    .play-circle
      top 48px
      img 
        width 60px
    .play-play
      top 68px
      img
        width 20px
  .audio-cont
    padding 0 20px
    position relative
    padding-bottom 10px
    background #fff
    z-index 20
    .audio-title
      color audio-title-color
      font-size 1.2em
      text-align center
      margin-bottom 6px
    .audio-desc
      color audio-desc-color
    .audio-time-ctrl
      position relative
      margin-top 10px
      //height 50px
      font-size 10px
      .audio-time
        color audio-title-color
        margin-bottom 3px
        .audio-alltime
          color audio-alltime-color
    .audioline
      height 30px
    .audio-line
      background url('../assets/images/bak-line2.png') no-repeat
      width 100%
      height 4px
    .audio-curr-line
      background url('../assets/images/color-line.png') no-repeat
      background-size 100% 100%
      transform translate3d(0,0,0)
      _transition(.2s, ease-in-out)
      width 0%
      height 5px
    .audio-line-spot
      background url('../assets/images/spot-line.png') no-repeat
      background-size 100% 100%
      transform translate3d(0,0,0)
      _transition(.2s, ease-in-out)
      width 16px
      height 16px
      position absolute
      bottom 20px
      margin-left -8px
      left 0%
  .item
    .item-left
      width 20%
      text-align center
      .item-head
        border 1px solid #fff
        border-radius 5px
        width 55px
        height 45px
        overflow hidden
        margin-bottom 5px
        img 
          width 55px 
          height 48px
    .item-right
      padding-left 5px
      text-align left
      width 78%
      .expert-name
        color main-color
        font-size 1.2em
        font-weight bold
      .expert-academic
        font-size 10px
        background weizi-color
        color main-color
        padding 3px 3px
        border 1px
        border-radius 3px
        margin-left 5px
      .item-cont
        height 58px
        overflow hidden
        color audio-desc-color
  .shengyu
    margin 10px 0
    padding 30px
    border 4px solid #F1E4DB
    border-radius 5px
    height 40px
    text-align center
    .fl
      margin-left 15%
      width 30%
      width 50px
      img
        height 50px
    .sheng-text
      text-align left
      margin-left 10px
      width 50%
      color audio-desc-color
  .shengyu-tips
    color audio-desc-color
    font-size 1.1em
    height 30px 
    line-height 30px
    .tick
      background url('../assets/images/tick.png') no-repeat center center
      background-size 60% 50%
      display inline-block
      width 20px
      height 20px
      border 1px solid #F1E4DB
      border-radius 2px
      margin-top 3px
    .tick-text
      display inline-block
      padding-bottom 10px


  a
    color audio-title-color !important
    text-decoration none


  @-webkit-keyframes change{
　　0%{-webkit-transform:rotate(0deg);}
　　50%{-webkit-transform:rotate(180deg);}
　　100%{-webkit-transform:rotate(360deg);}
  }
</style>
