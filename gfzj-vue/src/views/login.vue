// 微信扫码登录页
<template>
  <div>
    <div class="tc">
      <div class="erweima-wrap title-wrap clearfix">
        <img src="../assets/img/title-weixin.png" alt="二维码">
      </div>
      <div class="erweima-wrap mt20 mb5">
        <!--<img src="/static/specialist/img/erweima.png" alt="二维码">-->
        <img src="http://t.gaofen.com/static/specialist/img/erweima.png" alt="二维码">
      </div>
      <div class="font-white font-xl">请使用微信扫码登录</div>
    </div>
    <div class="ml30 mr30 mt20">
      <span class="title-label">第 1 步</span>
      <p class="font-white">长按二维码，保存至个人相册；</p>
      <span class="title-label">第 2 步</span>
      <p class="font-white">打开微信扫一扫，点击相册选择二维码图片进行扫面即可。</p>
    </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  export default {
    name: 'login',
    mixins: [globalMixins]
  }
</script>
<style lang="stylus" scoped>
  .erweima-wrap
    width 55%
    margin 0 auto
    img
      width 100%
  .title-wrap
    img
      width 85%
      float right
  .nav-menu
    display none
  .title-label
    display inline-block
    background-color #ffffff
    color #ff907b
    padding .02rem .05rem
    border-radius .06rem
  .clearfix
    &:before
    &:after
      display table
      content ""
      line-height 0
    &:after
     clear both

</style>
