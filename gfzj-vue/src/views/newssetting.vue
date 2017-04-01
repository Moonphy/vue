// 二维码页
<template>
  <div class="bg-white">
    <div class="row-panel" v-if="userType!==''">
      <div class="panel-title font-pink">新消息通知设置</div>
      <div class="panel-content">
        <ul>
          <li>
            <div class="fl">收到回复</div>
            <div class="fr"><input type="checkbox" @click="check(items.apply_receive, 'apply_receive')"  :checked="!!items.apply_receive" class="check-part"></div>
          </li>
          <li v-if="userType === 1">
            <div class="fl">收到提问</div>
            <div class="fr"><input @click="check(items.question_receive, 'question_receive')"  :checked="!!items.question_receive"  type="checkbox" class="check-part"></div>
          </li>
<!--           <li>
            <div class="fl">关注专家发布新方法</div>
            <div class="fr"><input type="checkbox" class="check-part"  @click="check(items.topic_publish, 'topic_publish')"  :checked="!!items.topic_publish"></div>
          </li> -->
          <li>
            <div class="fl">答案被偷偷听</div>
            <div class="fr"><input type="checkbox" class="check-part"  @click="check(items.answer_listen, 'answer_listen')"  :checked="!!items.answer_listen"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="row-panel" v-if="userType!==''">
      <div class="panel-title font-pink">提现通知设置</div>
      <div class="panel-content">
        <ul>
          <li>
            <div class="fl">发起提现</div>
            <div class="fr"><input type="checkbox" class="check-part"  @click="check(items.withdraw, 'withdraw')"  :checked="!!items.withdraw"></div>
          </li>
          <li>
            <div class="fl">提现成功</div>
            <div class="fr"><input type="checkbox" class="check-part"  @click="check(items.withdraw_success, 'withdraw_success')"  :checked="!!items.withdraw_success"></div>
          </li>
        </ul>
      </div>
    </div>
<!--     <div class="row-panel">
      <div class="panel-title font-pink">专家等级通知设置</div>
      <div class="panel-content">
        <ul>
          <li>
            <div class="fl">等级变化</div>
            <div class="fr"><input type="checkbox" class="check-part"  @click="check(items.level_change, 'level_change')"  :checked="!!items.level_change"></div>
          </li>
        </ul>
      </div>
    </div> -->
    <div class="tc pl20 pr20 pb40 pt20"  v-if="userType!==''"> 
      <input type="button" value="保存" @click="save()" class="btn btn-primary btn-block">
    </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  export default {
    name: 'newssetting',
    mixins: [globalMixins],
    data () {
      return {
        userType: '',
        items: {
          apply_receive: 0,  // 收到新的回复
          question_receive: 0,  // 收到新的提问
          topic_publish: 0,  // 关注专家发布了方法
          answer_listen: 0,  // 答案被偷听
          withdraw: 0,  // 发起提现
          withdraw_success: 0,  // 提现成功
          level_change: 0  // 等级变化
        }
      }
    },
    ready () {
      let self = this
      this.setPullLoad(true)
      this.getUser('', '', (info) => {
        // 获取用户是否已经关注豆计划
        self.userType = info.type
        self.setPullLoad(false)
      })
      this.setState(true)
      api.common.getData(this.apiInterface.template_settings).then(this.filterCallback).then((res) => {
        if (res.errno === 0) {
          this.items = res.rsm
        }
        this.setState(false)
      })
    },
    methods: {
      save () {
        if (this.loading) return
        this.setState(true)
        api.common.getData(this.apiInterface.save_template_settings, this.items).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.addNotice({
              type: 'success',
              content: '设置成功！'
            })
          } else {
            this.addNotice({
              type: 'error',
              content: '操作失败，请稍候再试'
            })
          }
          this.setState(false)
        })
      },
      check (v, str) {
        this.items[str] = !v ? 1 : 0
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/home.styl'

  .row-panel
    border-bottom .01rem solid #ddd
    .panel-title
      font-size .18rem
      padding .2rem
      padding-left .2rem
      border-bottom .01rem solid #ddd
    .panel-content
      padding 0 .4rem
      ul
        li
          &:last-child
            border-bottom 0
      li
        padding-bottom .04rem
        padding-top .15rem
        font-size .16rem
        border-bottom .01rem solid #ddd
        &:after
          content " "
          display block
          clear both
        .check-part
          width .52rem
          height .32rem
          border 1px solid #DFDFDF
          outline 0
          border-radius 16px
          box-sizing border-box
          background-color #DFDFDF
          -webkit-appearance none
          position relative
          -webkit-transition: background-color 0.1s, border 0.1s;
          transition: background-color 0.1s, border 0.1s;
          &:before
            content: " "
            position: absolute
            top 0
            left 0
            width .5rem
            height .3rem
            border-radius 15px
            background-color #FDFDFD
            transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1), -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1)
          &:after
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            width: .3rem;
            height: .3rem;
            border-radius: 15px;
            background-color: #FFFFFF;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
            -webkit-transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
            transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
            transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
            transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35), -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
          &:checked
            border-color: #04BE02;
            background-color: #04BE02;
            &:before
              background-color: #04BE02;
            &:after
              transform: translateX(20px)
              


</style>
