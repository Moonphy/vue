// 推荐方法列表页
<template>
  <div class="bg-white">
      <div class="list-title">
          <img src="../assets/img/list-title.png" alt="">
          <a class="btn-skip hidden" v-link="{path:'/publish'}">跳过推荐</a>
      </div>
      <ul class="ui-list">
          <li v-for="item in lists">
              <a href="#"  class="list-item" title=""@click.prevent='toPublish(item)'>
                  <span v-if="item.category_name" class="ui-label label-catalog"><i class="icon icon-catalog-{{item.category_id}}"></i>{{item.category_name}}</span>
                  <p>{{item.tips_name}}</p>
                  <i class="icon icon-right"></i>
              </a>
          </li>
      </ul>
      <div class="list-title pb40"  v-if="noNextPage === false">
        <a href="#" class="btn btn-primary btn-block" @click.prevent="getIndexList()">换一批</a>
      </div>
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
        WPage: 1,
        listLoading: false,
        noNextPage: true,
        lists: []
      }
    },
    ready () {
      this.getIndexList()
      console.log(this.$route.router.stringifyPath({path: '/publish'}))
    },
    methods: {
      getIndexList (page) {
        if (this.loading) return
        page = page || this.WPage
        // this.lists = []
        this.setState(true)
        api.common.getData(this.apiInterface.topic_tips, {
          page: page
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.lists = res.rsm
            if (this.lists.length === 0 && page === 1) {
              this.toPublish()
            }
            // this.addItem(this.lists, res.rsm)
            if (this.lists.length >= 5) {
              this.WPage = page + 1
              this.noNextPage = false
            } else {
              this.WPage = 1
              if (page === 1) {
                this.noNextPage = true
              }
            }
          }
          this.setState(false)
        })
      },
      toPublish (opt) {
        if (opt) {
          window.localStorage.setItem('publish-titleobj', window.JSON.stringify(opt))
        }
        this.$route.router.go({path: '/publish'})
      }
    }
  }
</script>
<style lang="stylus" scoped>
  body
    width 100%
    height 100%

  .list-title
    margin 0 auto
    padding .2rem .2rem .05rem .2rem
    position relative

  .list-title img
    width 100%

  .ui-list
    margin-left .2rem
  .list-item
    display block
    border-bottom .01rem solid #e5e5e5
    color #707070
    position relative
    padding-top .07rem
    p
      margin: .04rem .35rem .1rem 0;
      font-size: .14rem;

    .icon-right
      position absolute
      right .15rem
      bottom .12rem
    .icon
      width .2rem
      height .2rem
      vertical-align top

  .text-overflow
    width 90%
    white-space: nowrap;
    overflow: hidden;
    word-wrap: normal;
    text-overflow: ellipsis;

  .btn-skip
    background: #ffbf68;
    color: #ffffff;
    border-radius: .02rem;
    padding: .05rem;
    position: absolute;
    right: .3rem;
    top: 46%;
    margin-top: -.12rem;
    font-size: .12rem;


</style>
