<template>
  <div class="slide" id="slide">
    <ul class="slide-item clearfix" v-tap="slide($event)" id="slideBody" :style="styleObject">
      <li v-for="item in items" v-tap="touchli()" :style="listyle">
        <a href="{{item.url}}">
          <div class="ui-avatar">
            <img :src="item.img">
          </div>
          <div class="expert-cont">
            <strong class="expert-name">{{item.name}}</strong>
            <div class="expert-desc">{{item.text}}</div>
          </div>
        </a>
      </li>
      <li class="morebtn" :style="listyle">
        <a v-link="{path:'/more'}">
          &hellip;更多专家
        </a>
        <!--<div class="btn btn-default">...更多专家</div>-->
      </li>
    </ul>
    <div class="slide-btn">
      <span v-for="page in pages" :class="$index===currpage?'active':''" v-tap="topage($index)"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'items': {
      type: Array
    },
    'key': {
      type: String,
      default: '0'
    },
    'auto': {
      type: Boolean,
      default: true
    },
    'autoTime': {
      type: Number,
      default: 3000
    }
  },
  computed: {
    pages () {
      let pages = Math.ceil((this.items.length + 1) / 3)
      return pages === 1 ? 0 : pages
    },

    styleObject () {
      return {
        'left': (-(this.currpage) * this.liw * 3) + 'px',
        'width': (this.items.length + 2) * this.liw + 'px'
      }
    },

    listyle () {
      return {
        'width': this.liw + 'px'
      }
    }
  },
  data () {
    return {
      liw: '',
      currpage: 0,
      timer: null,
      pages: 0,
      direction: 'left'
    }
  },
  ready () {
    let slide = document.getElementById('slide')
    let totalWidth = slide.offsetWidth
    let liw = (totalWidth) / 3

    this.liw = liw

    this.$emit('setSlide', 0)
    if (this.auto) {
      this.play()
    }
  },
  methods: {
    slide (args) {
      clearInterval(this.timer)
      let dx = args[1]
      if (dx > 0 && dx > 10) {  // 向右移动
        if (this.currpage > 0) {
          --this.currpage
          this.direction = 'right'
        }
      } else if (dx < 0 && dx < -10) { // 向左移动
        if (this.currpage + 1 < this.pages) {
          ++this.currpage
          this.direction = 'left'
        }
      }
      this.play()
    },
    topage (index) {
      this.currpage = index
    },
    touchli () {
      // this.key = '33'
    },
    play () {
      var self = this
      this.timer = setInterval(() => {
        var page
        if (self.direction === 'right') {
          page = self.currpage - 1
          if (page >= 0) {
            self.currpage = page
          } else {
            self.currpage = 1
            self.direction = 'left'
          }
        } else if (self.direction === 'left') {
          page = self.currpage + 1
          if (page + 1 <= self.pages) {
            self.currpage = page
          } else {
            --self.currpage
            self.direction = 'right'
          }
        }
      }, this.autoTime)
    }
  }
}
</script>
<style lang="stylus">
  @import '../assets/stylus/_slide.styl'
</style>