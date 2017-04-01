// 二维码页
<template>
  <div class="ui-block bg-white">
    <div class="tc font-pink">首次进行消息提醒设置，需先自行关注微信公众号：豆计划（alldoujihua），获取最新动态消息</div>
    <div class="tc">
      <div class="font-pink mt10">豆计划二维码</div>
      <div class="erweima-wrap">
        <img src="/static/specialist/img/jihuaerwema.png" alt="二维码">
      </div>
    </div>
    <ul class="rule-list">
      <li>第一步：</li>
      <li>长按二维码，保存至个人相册；</li>
    </ul>
    <ul class="rule-list">
      <li>第二步：</li>
      <li>打开微信扫一扫，点击相册选择二维码图片进行扫描后，关注公众号：豆计划（alldoujihua）</li>
    </ul>
    <ul class="rule-list">
      <li>第三部：</li>
      <li>关注后，再次进入“消息提醒设置”</li>
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
<style lang="stylus" scoped>
  @import '../assets/stylus/home.styl'

  ul
    margin 0.3rem 0.2rem 0.1rem 0.3rem !important
    li
      list-style none !important

  .font-pink
    text-align left
  .font-pink.mt10
    text-align center
</style>
