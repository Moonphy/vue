// 二维码页
<template>
  <div class="ui-block bg-white">
    <div class="tc font-pink">个人链接</div>
    <div class="font-grey font-sm borer-b mt5 mb20 pb5">
      <a class="font-grey" v-link="{path:'/index'}" target="_blank">http://t.gaofen.com/m/specialist/#!/index</a>
    </div>
    <div class="tc">
      <div class="font-pink mt10">个人二维码</div>
      <div class="erweima-wrap">
        <img src="/static/specialist/img/erweima.png" alt="二维码">
      </div>
      <div class="font-pink font-sm">微信扫码，来【高分专家】听我的方法。</div>
    </div>
    <ul class="rule-list">
      <li>长按复制“个人链接”，登入微信公众号后台，在自定义菜单上添加该链接，菜单可命名为付费提问；</li>
      <li>长按二维码保存下来，把二维码插入到微信文章页面底部，即可引导用户付费向你提问；</li>
    </ul>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  export default {
    name: 'erweima',
    mixins: [globalMixins],
    data () {
      return {

      }
    },
    ready () {

    },
    methods: {

    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/home.styl'
</style>
