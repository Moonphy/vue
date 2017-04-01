// 最近活跃、热门推荐
<template>
  <div>
    <div class="audio-list mt0">
      <div class="list-title pt10">
        <span class="font-pink ml20">最近活跃</span>
      </div>
      <ul>
        <li v-for="item in newItems" class="item">
          <a v-link="{path:'/detail?tid='+item.topic_id}">
            <div class="ui-avatar fl">
              <img :src="item.avatar_file">
            </div>
            <div class="item-content">
              <div class="item-title">
                <strong>{{item.user_name}}</strong>
                <div class="fr font-grey-lither">
                  <span class="font-pink">{{item.fans_count || 0}}关注</span>
                  |
                  <span class="font-pink"> {{item.specialist_topic_count || item.topic_num || 0}}个方法</span>
                </div>
              </div>
              <div class="ablum-brief font-grey">{{item.signature}}</div>
            </div>
          </a>
        </li>
      </ul>
      <ul v-if="newItems.length === 0 && !pullLoad">
        <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> 
      </ul>
    </div>
    <div class="audio-list">
      <div class="list-title pt10">
        <span class="font-pink ml20">热门推荐</span>
      </div>
      <ul>
        <li v-for="item in hotItems" class="item">
          <a v-link="{path:'/detail?tid='+item.topic_id}">
            <div class="ui-avatar fl">
              <img :src="item.avatar_file">
            </div>
            <div class="item-content">
              <div class="item-title">
                <strong>{{item.user_name}}</strong>
                <div class="fr font-grey-lither">
                  <span class="font-pink">{{item.fans_count || 0}}关注</span>
                  |
                  <span class="font-pink"> {{item.specialist_topic_count || item.topic_num || 0}}个方法</span>
                </div>
              </div>
              <div class="ablum-brief font-grey">{{item.signature}}</div>
            </div>
          </a>
        </li>
      </ul>
      <ul v-if="hotItems.length === 0 && !pullLoad">
        <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> 
      </ul>
    </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  export default {
    name: 'more',
    mixins: [globalMixins],
    data () {
      return {
        newItems: [],
        hotItems: []
      }
    },
    ready () {
      if (this.expert.time && (new Date()).getTime() - this.expert.time < 120000) {
        this.newItems = this.expert.news
        this.hotItems = this.expert.hots
        return
      } else {
        this.getNew()
      }
    },
    methods: {
      getNew () {
        this.setPullLoad(true)
        api.common.getData(this.apiInterface.active_specialist_list).then(this.filterCallback).then((res) => {
          try {
            this.newItems = res.rsm
          } catch (e) {}
          this.getHot()
        })
      },
      getHot () {
        api.common.getData(this.apiInterface.hot_specialist_list).then(this.filterCallback).then((res) => {
          this.setPullLoad(false)
          try {
            this.hotItems = res.rsm
            this.setExpert({
              time: (new Date()).getTime(),
              news: this.newItems,
              hots: this.hotItems
            })
          } catch (e) {}
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/_audio-list.styl'
</style>
