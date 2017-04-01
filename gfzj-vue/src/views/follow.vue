// 关注者页
<template>
  <div class="bg-white">
    <ul class="follow-list">
      <li class="follow-item" v-for="item in followItems">
        <a v-if="item.type===1" v-link="{path:'/detail?tid='+item.topic_id}">
          <div class="ui-avatar fl">
            <img :src="item.avatar_file" alt="">
          </div>
          <i class="icon icon-right fr" ></i>
          <div class="item-content font-pink">
            <div class="item-title">
              <strong class="font-md">{{item.user_name}}</strong>
              <span class="ui-label ui-label-pink" v-if="item.signature">{{item.signature}}</span>
            </div>
            <div class="font-pink">
              <span>{{item.fans_count || 0}} 关注</span>
              <span class="font-grey-lither">|</span>
              <span>{{item.topic_num || 0}} 个方法</span>
            </div>
          </div>
        </a>
        <a v-if="item.type===2">
          <div class="ui-avatar fl">
            <img :src="item.avatar_file" alt="">
          </div>
          <div class="item-content font-pink">
            <div class="item-title">
              <strong class="font-md">{{item.user_name}}</strong>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  export default {
    name: 'follow',
    mixins: [globalMixins],
    data () {
      return {
        followItems: []
      }
    },
    ready () {
      this.getFollow(1)
    },
    methods: {
      getFollow (page) {
        this.setPullLoad(true)
        api.common.getData(this.apiInterface.follow_fans_list).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.followItems = res.rsm
          }
          this.setPullLoad(false)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/follow.styl'

</style>
