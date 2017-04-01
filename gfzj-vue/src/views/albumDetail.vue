// 专辑详情页
<template>
  <div>
    <div class="audio-list mt0">
      <div class="item album-item">
        <div class="ui-avatar fl"><img :src="album.special_cover_url" alt></div>
        <div class="item-content">
          <div class="item-title"><strong>{{album.special_name}}</strong></div>
          <div class="font-grey">{{album.special_description}}</div>
        </div>
      </div>
    </div>
    <div class="audio-list">
      <div class="list-title pt10">
        <span class="font-pink ml20">{{album.topic_num}}</span><span class="font-pink">个方法</span>
        <a class="fr font-grey mr20" @click.prevent="getList(1, 1)">收听排序&or;
        </a>
      </div>
      <List :items="topicItems" :show-expert="show"></List>
    </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import List from '../components/List.vue'
  import api from '../api/api'
  export default {
    name: 'albumDetail',
    mixins: [globalMixins],
    components: {
      List
    },
    data () {
      return {
        show: true,
        topicItemsStop: false,
        album: {},
        topicItems: [],
        user: {},
        sid: '', // 专辑ID
        WPage: 1 // 方法列表页码
      }
    },
    ready () {
      this.sid = this.$route.query.sid
      if (!this.sid) {
        this.$route.router.go({path: '/album'})
        return
      }
      this.getAlbum()
      this.initPage({
        getPage: this.getList
      })
    },
    beforeDestroy () {
      this.removeScrollPage()
    },
    methods: {
      getAlbum () {
        this.setState(true)
        api.common.getData(this.apiInterface.special_detail, {
          sid: this.sid
        }).then(this.filterCallback).then((res) => {
          this.album = res.rsm
          // this.getUser(this.album.special_name, this.album.special_cover_url)
          // this.pageShareData.common({
          //   title: this.album.special_name,
          //   imgUrl: this.album.special_cover_url,
          //   expertName: ''
          // }) // 微信分享
          // if (this.wxinited === true && this.isSetShare === false) {
          //   this.share()
          // }
          this.setShareData({
            title: this.album.special_name,
            imgUrl: this.album.special_cover_url
          })
          this.setState(false)
          this.getList(1)
        })
      },
      getList (page, order) {
        page = page || this.WPage
        if ((page === 1 && this.topicItems.length > 0) || this.topicItemsStop || this.pullLoad) return
        this.setPullLoad(true)
        api.common.getData(this.apiInterface.topic_list, {
          sid: this.sid,
          page: page,
          order: order
        }).then(this.filterCallback).then((res) => {
          this.setPullLoad(false)
          if (res.errno === 0) {
            if (this.addItem(this.topicItems, res.rsm) === 0 || this.album.topic_num === this.topicItems.length) {
              this.topicItemsStop = true
            }
            this.WPage = page + 1
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/_audio-list.styl'

</style>
