// 关注了页
<template>
  <div class="bg-white">
    <ul class="follow-list">
      <li class="follow-item" v-for="item in followItems" v-if="item.type===1">
        <a v-link="{path:'/detail?tid='+item.topic_id}">
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
              <span>{{item.fans_count|| 0}} 关注</span>
              <span class="font-grey-lither">|</span>
              <span>{{item.topic_num || 0}} 个方法</span>
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
    name: 'friends',
    mixins: [globalMixins],
    data () {
      return {
        page: 1,
        listLoading: false,
        followItemsStop: false,
        followItems: []
      }
    },
    ready () {
      this.getFollow(1)
      this.initPage({
        getPage: this.getFollow
      })
    },
    beforeDestroy () {
      this.removeScrollPage()
    },
    methods: {
      getFollow (page) {
        if (this.followItemsStop || this.listLoading) return
        page = page || this.page
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.follow_friends_list, {
          page: page
        }).then(this.filterCallback).then((res) => {
          this.listLoading = false
          if (res.errno === 0) {
            if (this.addItem(this.followItems, res.rsm) === 0 || this.followItems < 5) {
              this.followItemsStop = true
            }
            this.page = page + 1
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
