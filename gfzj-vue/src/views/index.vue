<template>
  <div>
    <form class="home-avatar">
<!--       <input type="text" placeholder="查找专家或方法">
      <input type="button" class="btn-search"> -->
    </form>
    <div class="more-sorts">
      <a v-for="item in catalogs" v-link="{path:'/catalogs?id='+item.id}" class="catalogItem">
        <img :src="item.img" />
        <p>{{item.category_name}}</p>
      </a>
    </div>
<!--     <div class="ranking-list">
      <img src="../assets/img/list-title-hot.png">
      <Slide :items="experts"></Slide>
    </div>
    <div class="ranking-list">
      <img src="../assets/img/list-title-new.png">
      <Slide :items="newexperts"></Slide>
    </div> -->
    <div class="audio-list">
      <div class="list-title">
        <span class="font-pink ml20">专家方法</span>
        <a href="#" @click.prevent="changeWay()" class="fr mr20" v-if="noNextPage === false">换一批</a>
      </div>
      <List :items="audioItems" :show-expert="show" class="opacitycs" transition="opacitycs"></List>
      <template v-if="WPage===1 && audioItems.length === 0 && pullLoad === false">
          <div class="list">
            <ul> <li class="bg-grey ml0 mr0"> <div class="tc pt50 pb50"> 暂时没有信息 </div> </li> </ul>
          </div>
        </template>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins.js'
  import api from '../api/api'
  import Slide from '../components/Slide'
  import List from '../components/List'
  export default {
    name: 'index',
    mixins: [globalMixins],
    components: {
      Slide,
      List
    },
    data () {
      return {
        show: true,
        WPage: 1, // 方法列表页码
        type: 2,
        audioItemsStop: false,
        catalogs: [
          /* {id: 1, category_name: '父母成长', img: '/static/specialist/img/catalog-1.png'},
          {id: 2, category_name: '家庭关系', img: '/static/specialist/img/catalog-2.png'},
          {id: 3, category_name: '教育方式', img: '/static/specialist/img/catalog-3.png'},
          {id: 4, category_name: '理解孩子', img: '/static/specialist/img/catalog-4.png'},
          {id: 5, category_name: '家庭学习', img: '/static/specialist/img/catalog-5.png'},
          {id: 6, category_name: '品质塑造', img: '/static/specialist/img/catalog-6.png'},
          {id: 7, category_name: '生活指导', img: '/static/specialist/img/catalog-7.png'},
          {id: 8, category_name: '社会交往', img: '/static/specialist/img/catalog-8.png'}*/
        ],
        experts: [
          {id: 1, url: 'http://t.gaofen.com/m/specialist/#!/detail?tid=19304', name: '史秀荣', text: '北京师范大学教育博士', img: '/static/specialist/img/authorImg/hot-shixiurong.png'},
          {id: 2, url: 'http://t.gaofen.com/m/specialist/#!/detail?tid=19299', name: '廖文', text: '华南师范大学教育专家', img: '/static/specialist/img/authorImg/hot-liaowen.png'},
          {id: 3, url: 'http://t.gaofen.com/m/specialist/#!/detail?tid=19310', name: '红茶紫烟', text: '心理咨询督导师', img: 'http://i.gaofen.com/uploads/avatar/000/00/42/35_avatar_max.jpg'},
          {id: 4, url: 'http://t.gaofen.com/m/specialist/#!/more', name: '张宏涛', text: '家庭教育指导师', img: '/static/specialist/img/authorImg/hot-zhanghongtao.jpg'},
          {id: 5, url: 'http://t.gaofen.com/m/specialist/#!/more', name: '王柳萌', text: '少儿学习能力训练师', img: '/static/specialist/img/authorImg/hot-wangliumeng.jpg'}
        ],
        newexperts: [
          {id: 1, url: 'http://t.gaofen.com/m/specialist/#!/detail?tid=19294', name: '黄頔', text: '暨南大学语言学博士', img: '/static/specialist/img/authorImg/new-huangyou.png'},
          {id: 2, url: 'http://t.gaofen.com/m/specialist/#!/more', name: '兰兰妈', text: '《中国教育报》撰稿人', img: '/static/specialist/img/authorImg/new-lanlanma.png'},
          {id: 3, url: 'http://t.gaofen.com/m/specialist/#!/detail?tid=19300', name: '周子超', text: '国家三级心理咨询师', img: 'http://i.gaofen.com/uploads/avatar/000/00/11/44_avatar_max.jpg'},
          {id: 4, url: 'http://t.gaofen.com/m/specialist/#!/more', name: '唐娜', text: '心理学硕士', img: '/static/specialist/img/authorImg/new-tangna.jpg'},
          {id: 5, url: 'http://t.gaofen.com/m/specialist/#!/more', name: '吴映泓', text: '沙盘游戏治疗师', img: '/static/specialist/img/authorImg/new-wuyinghong.jpg'}
        ],
        audioItems: [],
        noNextPage: true,
        search_val: ''
      }
    },
    ready () {
      // this.wxsign()
      if (this.category) {
        this.catalogs = this.category
      } else {
        this.getCatalog()
      }
      // this.setState(true)
      // this.getHot()
      if (this.expertWay.time && (new Date()).getTime() - this.expertWay.time < 300000) {
        this.audioItems = this.expertWay.data
        if (this.audioItems.length >= 5) {
          this.noNextPage = false
        }
        return
      } else {
        this.getIndexList(1)
      }
      // this.addNotice({
      //   type: 'success',
      //   content: '注册成功！'
      // }, 10000)
      // this.handleError('------asdfad')
    },
    methods: {
      catalog (id) {
        // console.log('id:' + id)
      },
      changeWay () {
        this.getIndexList()
      },
      getCatalog () {
        this.setState(true)
        api.common.getData(this.apiInterface.topic_category).then(this.filterCallback).then((res) => {
          this.setState(false)
          this.catalogs = res.rsm
          for (let i = 0; i < this.catalogs.length; i++) {
            this.catalogs[i].img = '/static/specialist/img/catalog-' + (i + 1) + '.png'
          }
          this.setcategory(this.catalogs)
        })
      },
      // getHot () {
      //   api.common.uploadWeixinServerid(this.apiInterface.topic_hot, '', {
      //     params: {}
      //   }).then((res) => {
      //     if (res.data.errno === 0) {
      //       this.catalogs = res.data.rsm.topic_category
      //     }
      //   }).catch(() => {

      //   })
      // },
      getIndexList (page) {
        if (this.pullLoad) return
        page = page || this.WPage
        this.audioItems = []
        this.setPullLoad(true)
        api.common.getData(this.apiInterface.topic_hot_topic_list, {
          page: page
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.audioItems = res.rsm
            if (page === 1) {
              this.setExpertWay({
                time: (new Date()).getTime(),
                data: this.audioItems
              })
            }
            if (this.audioItems.length >= 5) {
              this.WPage = page + 1
              this.noNextPage = false
            } else {
              this.WPage = 1
              if (page === 1) {
                this.noNextPage = true
              }
            }
            // if (this.addItem(this.audioItems, res.rsm) === 0) {
            //   this.audioItemsStop = true
            // }
            // this.WPage = page + 1
          }
          this.setPullLoad(false)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/index'
  .catalogItem
    display inline-block


</style>
