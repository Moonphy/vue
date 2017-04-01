// 提现页
<template>
  <div class="ui-block bg-white">
    <div class="tc font-money"><i class="icon icon-wallet"></i>
      <div class="font-grey font-xl">总收入</div>
      <div class="font-pink font-xxxl font-money">{{user.income || 0}}</div>
    </div>
    <ul class="rule-list">
      <li>收入金额达1元以上，方可提现；</li>
      <li>确认提现后，全部收入会在1个工作日内入库微信钱包；</li>
      <li>你的提问若72小时内没得到回复，支付金额会自动退还至微信钱包，不计入总收入；</li>
    </ul>
    <a v-link="{path:'/home'}" title="" class="btn btn-primary btn-block">去提问，赚分成</a>
    <a href="" title="" class="btn btn-block mt15" :class="[user.income>=1 ? 'btn-primary':'']" @click.prevent="draw_money()">申请提现</a>
    <div class="font-grey tc">收益不足1元不能提现</div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  export default {
    name: 'cash',
    mixins: [globalMixins],
    data () {
      return {
        user: {}
      }
    },
    ready () {
      this.getIncome()
    },
    methods: {
      getIncome () {
        this.setState(true)
        api.common.getData(this.apiInterface.user_index).then(this.filterCallback).then((res) => {
          this.setState(false)
          if (res.errno === 0) {
            this.user = res.rsm
          } else {
            this.addNotice({type: 'error', content: '请求失败'})
          }
        })
      },
      draw_money () {
        if (this.user.income < 1) return
        if (this.loading === true) return
        this.setState(true)
        api.common.getData(this.apiInterface.draw_money).then(this.filterCallback).then((res) => {
          this.setState(false)
          if (res.errno === 0) {
            this.addNotice({type: 'success', content: '申请成功！'})
            this.getIncome()
            if (this.userinfo.time) { // 重新获取个人数据
              this.userinfo.time = 0
            }
          } else {
            this.addNotice({type: 'error', content: res.err})
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/home.styl'
</style>
