
class AudioCtrl {

  constructor (opt) {
    // if (!opt.id) {
    //   return
    // }
    // console.log(opt)
    this.audioArea = this.$(opt.audioArea)
    this.audioRun = this.$(opt.audioRun)
    this.audioSpot = this.$(opt.audioSpot)
    this.data = opt.data

    // console.log(this.audioArea.offsetWidth)
    if (!this.audioArea) return

    this.audioPlayer = opt.audioPlayer

    this.domleft = ''
    this.totalTimeSec = 0
  }

  set areawidth (v) {
    this._areawidth = v
  }

  get areawidth () {
    return this._areawidth
  }

  init () {
    try {
      this.areawidth = this.audioArea.offsetWidth
    } catch (e) {}
    let getOffleft = (dom) => {
      let left = 0
      while (dom.tagName !== 'HTML') {
        left += dom.offsetLeft
        dom = dom.parentNode
      }
      this.domleft = left
    }
    getOffleft(this.audioArea)
    let self = this

    this.audioPlayer.on('timeupdate', function (formatTime, playedPercent, position, duration) {
      // console.log(playedPercent)
      // let movePlaySec = parseInt(this.totalTimeSec * percent / 100, 10)
      // console.log('timeupdate', self.data)
      self.data.nowTime = formatTime
      self.setProgress(playedPercent)
    })

    this.audioPlayer.on('ended', function () {
      self.data.playing = false
      self.data.nowTime = '00:00'
      self.setProgress(0)
    })

    this.audioPlayer.on('canplay', function (totalTime, name, item) {
      self.totalTimeSec = self.formatTimeToSec(totalTime)
      self.data.allTime = totalTime
      self.data.nowTime = '00:00'
    })

    var progresswh = this.audioArea.offsetWidth
    var ml = (document.body.offsetWidth - progresswh) / 2
    var progress
    this.audioSpot.addEventListener('touchmove', function (e) {
      if (self.data.playing === true) {
        var l = e.changedTouches[0].clientX - ml
        if (l < 0) l = 0
        if (l > progresswh) l = progresswh
        progress = Math.floor((l / progresswh) * 100)
        self.setProgress(progress)
        self.audioPlayer.progress(Math.floor(self.data.allTime * progress / 100))
      }
    }, false)

    this.audioSpot.addEventListener('touchend', function (e) {
      if (self.data.playing === true) {
        // self.audioPlayer.pause()
        self.audioPlayer.progress(self.audioPlayer.audio.currentTime)
        // self.audioPlayer.play()
      }
    }, false)

    // this.audioArea.on('touchend', function (e) {
    //   e.preventDefault()
    //   console.log('touchend')
    // })

    this.setProgress(0)
  }

  $ (id) {
    return document.getElementById(id)
  }

  getPercent (x) {
    return (x - this.domleft) / this.areawidth * 100
  }

  setProgress (movePercent) {
    // progress = movePercent
    // console.log(movePercent)
    this.audioRun.style.width = movePercent + '%'
    // this.audioSpot.style.left = movePercent + '%'
  }

  run (x) {
    let percent = this.getPercent(x)
    this.runProgress(percent)
    this.setProgress(percent)
  }

  runProgress (percent) {
    this.audioPlayer.pause()
    let movePlaySec = parseInt(this.totalTimeSec * percent / 100, 10)
    this.audioPlayer.progress(movePlaySec)
    this.audioPlayer.play()
  }

  formatTimeToSec (time) {
    try {
      var times = time.split(':')
      return Number(times[0]) * 60 + Number(times[1])
    } catch (e) {
      return ''
    }
  }

  reset (data) {
    this.setProgress(0)
  }

}

export default AudioCtrl
