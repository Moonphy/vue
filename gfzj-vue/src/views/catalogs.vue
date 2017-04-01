// 分类页
<template>
  <div>
    <div class="audio-list mt0">
      <div class="ui-tab">
        <div :class="['tab', type === 2 ? 'active': '']" v-tap="stab(2)">
          <span>方法</span><span v-if="WPage>1">({{audioItems.length}})</span>
        </div>
        <div :class="['tab', type === 1 ? 'active': '']"  v-tap="stab(1)">
          <span>专家</span><span v-if="EPage>1">({{expertItems.length}})</span>
        </div>
      </div>
      <div class="tab-container" v-show="type===2">
        <List :items="audioItems" :show-expert="show"></List>
        <ul v-if="audioItems.length === 0 && WPageStop">
          <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> 
        </ul>
      </div>
      <div class="tab-container"  v-show="type===1">
        <Experts :items="expertItems"></Experts>
        <ul v-if="expertItems.length === 0 && EPageStop">
          <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> 
        </ul>
      </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import List from '../components/List.vue'
  import Experts from '../components/Experts.vue'
  import api from '../api/api'
  export default {
    name: 'catalogs',
    mixins: [globalMixins],
    components: {
      Experts,
      List
    },
    data () {
      return {
        show: true,
        EPageStop: false,
        WPageStop: false,
        expertItems: [],
        audioItems: [],
        pageLoading: false,
        type: 2, // 默认方法列表
        id: '',   // 分类ID
        EPage: 1, // 专家列表页码
        WPage: 1  // 方法列表页码
      }
    },
    ready () {
      this.id = this.$route.query.id
      if (!this.id) {
        this.$route.router.go({path: '/index'})
        return
      }
      this.getList()
      this.initPage({
        getPage: this.getList
      })
    },
    beforeDestroy () {
      this.removeScrollPage()
    },
    methods: {
      /* getId () {
        let _s = window.location.hash
        let _id = _s.split('?')[1].split('=')[1]
        this.id = _id
      },*/
      stab (type) {
        this.type = type
        if ((this.type === 1 && this.EPage === 1) || (this.type === 2 && this.WPage === 1)) {
          this.getList()
        }
      },
      getList (page) {
        if (this.type === 1 && this.EPageStop === true) return
        if (this.type === 2 && this.WPageStop === true) return
        if (this.pageLoading === true) return
        page = page || (this.type === 1 ? this.EPage : this.WPage)
        this.setPullLoad(true)
        this.pageLoading = true
        api.common.getData(this.apiInterface.topic_category_detail_list, {
          id: this.id,
          page: page,
          type: this.type
        }).then(this.filterCallback).then((res) => {
          this.pageLoading = false
          if (res.errno === 0) {
            if (this.type === 1) {
              if (this.addItem(this.expertItems, res.rsm) === 0) {
                this.EPageStop = true
              }
              this.EPage = page + 1
            } else {
              if (this.addItem(this.audioItems, res.rsm) === 0) {
                this.WPageStop = true
              }
              this.WPage = page + 1
            }
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
