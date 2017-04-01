// 专辑页
<template>
  <div class="audio-list">
    <ul>
      <li v-for="item in specialItems" class="item">
        <a v-link="{path:'/albumDetail?sid='+item.id}">
          <div class="ui-avatar fl">
            <img :src="item.special_cover_url">
            <div class="ui-label label-pink">
              <span>{{item.topic_num}}</span>个方法
            </div>
          </div>
          <div class="item-content">
            <div class="item-title"><strong>{{item.special_name}}</strong></div>
            <div class="ablum-brief font-grey">{{item.special_description}}</div>
          </div>
        </a>
      </li>
    </ul>
    <ul v-if="specialItems.length === 0 && !pullLoad">
      <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> 
    </ul>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  export default {
    name: 'album',
    mixins: [globalMixins],
    data () {
      return {
        SPage: 1,
        listLoading: false,
        specialItemsStop: false,
        specialItems: []
      }
    },
    ready () {
      // this.setPullLoad(false)
      if (this.album) {
        this.specialItems = this.album
        this.SPage ++
      } else {
        this.getSpecial(1)
      }
      this.initPage({
        getPage: this.getSpecial
      })
    },
    beforeDestroy () {
      this.removeScrollPage()
    },
    methods: {
      getSpecial (page) {
        if (this.specialItemsStop || this.listLoading) return
        // if (this.pullLoad === true) return
        page = page || this.SPage
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.special_list, {
          page: page
        }).then(this.filterCallback).then((res) => {
          this.listLoading = false
          if (res.errno === 0) {
            if (this.addItem(this.specialItems, res.rsm) === 0 || this.specialItems < 5) {
              this.specialItemsStop = true
            }
            if (this.SPage === 1) {
              this.setalbum(this.specialItems)
            }
            this.SPage = page + 1
          }
          this.setPullLoad(false)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/_audio-list.styl'

</style>
