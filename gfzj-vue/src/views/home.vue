// 个人页
<template>
  <div class="home">
    <a v-link="{path:'/titlelist'}" class="btn btn-trans" v-if="user.type===1">发布方法</a>
    <div class="home-avatar clearfix">
      <div class="ui-avatar fl" v-if="user.avatar">
        <img :src="user.avatar">
      </div>
      <div class="home-avatar-right fr">
        <a class="btn-edit hidden" v-link="{path:'/edit'}">
          <i class="icon icon-edit"></i>
          <div class="font-grey">编辑</div>
        </a>
        <a class="btn-edit" v-link="{path:settingUrl}" v-if="settingUrl">
          <i class="icon icon-attention"></i>
          <div class="font-grey">提醒</div>
        </a>
        <a class="btn-edit" v-link="{path:'/erweima'}" v-if="user.type===1">
          <i class="icon icon-erweima"></i>
          <div class="font-grey">二维码</div>
        </a>
      </div>
      <div class="home-avatar-center" v-if="user.user_name">
        <div class="font-pink disabled user-name">{{user.user_name}}</div>
        <span class="ui-label ui-label-pink" v-show="user.type===1 && user.reason">{{user.reason}}</span>
      </div>
    </div>
    <div class="row-flex">
      <a v-link="{path:'/cash'}">
        <div class="font-grey">总收入</div>
        <div class="font-pink">{{user.income || 0}}</div>
        <div class="ui-label label-green">提现</div>
      </a>
      <a v-link="{path:'/friends'}">
        <div class="font-grey">关注了</div>
        <div class="font-pink">{{user.friend_count}}人</div>
      </a>
      <a v-if="user.type===1" v-link="{path:'/follow'}">
        <div class="font-grey">关注者</div>
        <div class="font-pink">{{user.fans_count}}人</div>
      </a>
    </div>
    <div class="audio-list mt10">
      <div class="ui-tab">
        <div :class="['tab', tab === 1 ? 'active': '']" v-tap="getEList(1, 1)">
          <span>专家动态</span>
        </div>
        <div :class="['tab', tab === 2 ? 'active': '']" v-tap="getNList(2)">
          <span>我的消息</span><sup class="dot" v-if="isTips"></sup>
        </div>
        <div :class="['tab', tab === 3 ? 'active': '']" v-tap="getTopicList(1, 3)" v-if="user.type===1">
          <span>我的方法</span>
        </div>
        <div :class="['tab', tab === 3 ? 'active': '']" v-tap="getListenList(1, 3)" v-if="user.type===2">
          <span>我的收听</span>
        </div>
      </div>
      <audio :src="currentUrl" class="q-player" id="voice_audio" ></audio>
      <!--专家动态-->
      <div class="tab-container" v-show="tab===1"  transition="opacitycs">
        <ul v-if="EItems.length">
          <li v-for="item in EItems" >
            <a v-if="item.type===1" v-link="{path:'/detail?tid='+item.topic_data.topic_id}" :class="['item ', playing ? 'item-play' : 'item-play item-stop']">
              <div class="ui-avatar fl">
                <img :src="item.topic_data.topic_cover_url">
              </div>
              <div class="item-content">
                <div class="item-title">
                  <strong>{{item.topic_data.topic_name}}</strong>
                </div>
                <div class="tr font-grey content-bottom font-sm">
                  <span class="fl">专家：{{item.topic_data.user.user_name}}</span>
                  <span>{{item.add_time | timestampToday}}</span>
                </div>
              </div>
            </a>
            <div class="q-item" v-if="item.type===2">
              <div class="ui-avatar fl">
                <img :src="item.question_data.user.avatar_file" alt=""/>
              </div>
              <div class="item-content"><strong class="font-pink">{{item.question_data.user.user_name}}</strong>
                <p>{{item.question_data.question_name}}</p>
                <div class="q-row">
                  <div class="ui-avatar fl">
                    <img :src="item.answer_data.user.avatar_file" alt=""/>
                  </div>
                  <div class="q-audio-wrap">
                    <div class="triangle-left"></div>
                    <div @click="pay(item)" :class="['q-audio', item.currentUrl===currentUrl ? 'q-play': '']">
                      <span class="q-line-1"></span>
                      <span class="q-line-2"></span>
                      <span class="q-line-3"></span>
                      <time>{{item.answer_data.record_time}}"</time>
                      <div class="ui-label ui-label-green" v-if="item.answer_data.belong === 0">{{item.record_pay||1}}元偷偷听</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="font-grey font-sm mt10">
                来自
                <span class="font-pink">{{item.answer_data.user.user_name}}</span>
                的方法提问回复
                <div class="fr" v-if="item.heat_num"><span class="ml10">{{item.answer_data.add_time | timestampToday}}</span></div>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="EItemsStop && EItems.length===0">
          <li class="bg-grey ml0 mr0">
            <div class="tc pt50 pb50">
              你还没有关注专家哦，去关注他们吧！
            </div>
          </li>
        </ul>
      </div>
      <!--我的消息-->
      <div class="tab-container" v-show="tab===2"  transition="opacitycs">
        <ul v-if="NItems.length">
          <li v-for="item in NItems">
            <a class="item" v-if="item.action_type===902&&item.data.answer_id===null" v-link="{path:'/reply?id='+item.data.question_id}">
              <div class="ui-avatar fl">
                <img :src="item.data.user.avatar_file" alt>
              </div>
              <div class="item-content">
                <div class="item-title"><strong class="font-pink">{{item.data.user.user_name}}</strong>
                  <div class="fr">
                    <span class="ui-label ui-label-pink" v-if="item.data.answer_id===null">未回复</span>
                  </div>
                </div>
                <div class="font-grey">{{item.data.question_name}}</div>
              </div>
              <div class="font-grey font-sm mt10">
                <span>来自</span>
                <span class="font-pink">{{item.data.topic.topic_name}}</span>
                <span v-if="item.data.question.is_free === 0">限时免费向你提问</span>
                <span v-else>的提问</span>
              </div>
            </a>
            <a class="item" v-if="item.action_type===902&&item.data.answer_id!==null" v-link="{path:'/replyed?id='+item.data.question_id}">
              <div class="ui-avatar fl">
                <img :src="item.data.user.avatar_file" alt>
              </div>
              <div class="item-content">
                <div class="item-title"><strong class="font-pink">{{item.data.user.user_name}}</strong>
                  <div class="fr">
                    <span class="ui-label ui-label-grey" v-if="item.data.answer_id!==null">已回复</span>
                  </div>
                </div>
                <div class="font-grey">{{item.data.question_name}}</div>
              </div>
              <div class="font-grey font-sm mt10">
                <span>来自</span>
                <span class="font-pink">{{item.data.topic.topic_name}}</span>
                <span>的追问</span>
              </div>
            </a>
            <div class="item" v-if="item.action_type===903">
              <div>你在方法
                <span class="font-pink">{{item.data.topic_name}}</span>下的回答被偷听了1次，获得
                <span class="font-pink">0.4元</span>收入。
              </div>
            </div>
            <div class="q-item" v-if="item.action_type===901">
              <p>{{item.data.question.question_name}}</p>
              <div class="q-row">
                <div class="ui-avatar fl">
                  <img :src="item.data.user.avatar_file" alt="">
                </div>
                <div class="q-audio-wrap">
                  <div class="triangle-left"></div>
                  <div @click="pay(item)" :class="['q-audio', item.currentUrl===currentUrl ? 'q-play': '']">
                    <span class="q-line-1"></span>
                    <span class="q-line-2"></span>
                    <span class="q-line-3"></span>
                    <time>{{item.data.record_time}}"</time>
                  </div>
                  <!--<a v-link="" class="pursue-ask">追问</a>-->
                </div>
              </div>
              <div class="font-grey font-sm mt10">
                <span>来自</span>
                <span class="font-pink">{{item.data.user.user_name}}</span>
                <span v-if="item.data.question.is_free === 0">限时免费提问回复</span>
                <span v-else>提问回复</span>
                <div class="fr">{{item.add_time | timestampToday}}</div>
              </div>
            </div>
          </li>
        </ul>
        <ul v-if="NItems.length===0 && NItemsStop && !pullLoad">
          <li class="bg-grey ml0 mr0">
            <div class="tc pt50 pb50">
              暂时还没任何消息，去提问吧！
            </div>
          </li>
        </ul>
      </div>


      <!--我的方法数据 我的收听数据-->
      <div class="tab-container" v-show="tab===3"  transition="opacitycs">
        <!--我的方法数据-->
        <div v-if="user.type===1">
          <List :items="TItems" :show-expert="expertshow"></List>
          <ul v-if="TItems.length===0 && TItemsStop">
            <li class="bg-grey ml0 mr0">
              <div class="tc pt50 pb50">
                你还没有方法哦，去发布方法吧！
              </div>
            </li>
          </ul>
        </div>
        <!--我的收听数据-->
        <div v-if="user.type===2">
          <ul v-if="LItems.length">
            <li v-for="item in LItems">
              <a v-if="item.type===1" v-link="{path:'/detail?tid='+item.topic_data.topic_id}" :class="['item ', playing ? 'item-play' : 'item-play item-stop']">
                <div class="ui-avatar fl">
                  <img :src="item.topic_data.topic_cover_url">
                </div>
                <div class="item-content">
                  <div class="item-title">
                    <strong>{{item.topic_data.topic_name}}</strong>
                  </div>
                  <div class="tr font-grey content-bottom font-sm">
                    <span class="fl">专家：{{item.specialist_data.user_name}}</span>
                    <span>{{item.add_time | timestampToday}}</span>
                  </div>
                </div>
              </a>
              <div class="q-item" v-if="item.type===2">
                <div class="ui-avatar fl">
                  <img :src="item.question_data.user.avatar_file" alt="alt"/>
                </div>
                <div class="item-content">
                  <strong class="font-pink">{{item.question_data.question_user_name}}</strong>
                  <p>{{item.question_data.question_name}}</p>
                  <div class="q-row">
                    <div class="ui-avatar fl">
                      <img :src="item.specialist_data.avatar_file" alt="alt"/>
                    </div>
                    <div class="q-audio-wrap">
                      <div class="triangle-left"></div>
                      <div @click="pay(item)" :class="['q-audio', item.currentUrl===currentUrl ? 'q-play': '']">
                        <span class="q-line-1"></span>
                        <span class="q-line-2"></span>
                        <span class="q-line-3"></span>
                        <time>{{item.answer_data.record_time}}"</time>
                        <div class="ui-label ui-label-green" v-if="item.belong === 0">{{item.record_pay || 1}}元偷偷听</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="font-grey font-sm mt10">
                  来自
                  <span class="font-pink">{{item.specialist_data.user_name}}</span> 的方法提问
                  <div class="fr" v-if="item.heat_num"><span class="ml10">{{item.add_time | timestampToday}}</span></div>
                </div>
              </div>
            </li>
          </ul>
          <ul v-if="LItems.length===0 && LItemsStop">
            <li class="bg-grey ml0 mr0">
              <div class="tc pt50 pb50">
                你还没有收听方法哦，去找找吧！
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  import List from '../components/List.vue'
  import api from '../api/api'
  export default {
    name: 'home',
    mixins: [globalMixins],
    props: {

    },
    components: {
      List
    },
    data () {
      return {
        // settingUrl: '/newssetting', // 设置消息页面
        settingUrl: '',
        listLoading: false,
        voiceAudio: '',
        expertshow: false,
        currentUrl: '',
        user: {},
        tab: 2,
        isTips: false, // 我的消息小红点
        EPage: 1, // 专家动态列表页码
        LPage: 1, // 我的收听列表页码
        TPage: 1, // 我的方法列表页码
        EItemsStop: false,
        NItemsStop: false,
        TItemsStop: false,
        LItemsStop: false,
        EItems: [], // 专家动态数据
        NItems: [], // 我的消息数据
        TItems: [], // 我的方法数据
        LItems: [] // 我的收听数据
      }
    },
    watch: {
      'tab' () {
        this.currentUrl = ''
        console.log('home-watch')
        // this.setPullLoad(false)
        // document.getElementById('voice_audio').pause()
      },
      'NItems' (list) {
        for (var i = 0; i < list.length; i++) {
          if (!list[i].data.answer_id) {
            this.isTips = true
            break
          }
        }
      }
    },
    ready () {
      let self = this
      this.getUser('', '', (info) => {
        // 获取用户是否已经关注豆计划
        if (info.subscribe === 0) {
          self.settingUrl = '/attention' // 关注豆计划
        } else {
          self.settingUrl = '/newssetting'
        }
      })

      if (window.location.href.indexOf('tab=2') > -1) {
        this.getNList()
      } else {
        this.getEList(1, 1)
      }

      this.initPage({
        getPage: () => {
          if (self.tab === 1) {
            self.getEList('', 1)
          } else if (self.tab === 3 && self.user.type === 2) {
            self.getListenList('', 3)
          } else if (self.tab === 3 && self.user.type === 1) {
            self.getTopicList('', 3)
          }
        }
      })
      this.voiceAudio = document.getElementById('voice_audio')

      this.voiceAudio.addEventListener('ended', () => {
        self.currentUrl = ''
      })

      this.voiceAudio.addEventListener('canplay', () => {
        self.setState(false)
        self.voiceAudio.play()
      })
    },
    beforeDestroy () {
      this.removeScrollPage()
    },
    methods: {
      getIndex () {
        return this.listindex++
      },
      // getUser () {
      //   if (this.userinfo.time) {
      //     if ((new Date()).getTime() - this.userinfo.time < 300000) {
      //       this.user = this.userinfo.user
      //       this.setShareData({
      //         imgUrl: this.user.avatar
      //       })
      //       return
      //     }
      //   }
      //   this.setState(true)
      //   api.common.getData(this.apiInterface.user_index).then(this.filterCallback).then((res) => {
      //     this.user = res.rsm
      //     this.setuserinfo({
      //       time: (new Date()).getTime(),
      //       user: this.user
      //     })
      //     this.setShareData({
      //       imgUrl: this.user.avatar
      //     })
      //     this.setShareData({
      //       title: this.album.special_name,
      //       imgUrl: this.album.special_cover_url
      //     })
      //     this.setState(false)
      //   })
      // },
      getEList (page, tab) {
        this.setPullLoad(false)
        this.tab = tab
        if ((page === 1 && this.EItems.length > 0) || this.EItemsStop || this.listLoading) return
        page = page || this.EPage
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.dynamic_list, {
          page: page
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            if (this.addItem(this.EItems, res.rsm) === 0) {
              this.EItemsStop = true
              this.setPullLoad(false)
            }
            if (page === 1) {
              this.getNList()
            }
            this.EPage = page + 1
            // this.EItems = res.rsm
          }
          this.listLoading = false
          // this.setPullLoad(false)
        })
      },
      /* 我的消息*/
      getNList (tab) {
        this.setPullLoad(false)
        if (tab) {
          this.tab = tab
        }
        if (this.NItems.length > 0) return
        if (tab) this.setPullLoad(true)
        api.common.getData(this.apiInterface.notify_list).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            this.NItems = res.rsm
            this.NItemsStop = true
          }
          this.setPullLoad(false)
        })
      },
      /* 我的收听*/
      getListenList (page, tab) {
        this.setPullLoad(false)
        this.tab = tab
        if ((page === 1 && this.LItems.length > 0) || this.LItemsStop || this.listLoading) return
        page = page || this.LPage
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.my_listen, {
          page: page
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            if (this.addItem(this.LItems, res.rsm) === 0 || res.rsm.length < 5) {
              this.LItemsStop = true
              this.setPullLoad(false)
            }
            this.LPage = page + 1
          }
          this.listLoading = false
          // this.setPullLoad(false)
        })
      },
      /* 我的方法*/
      getTopicList (page, tab) {
        this.setPullLoad(false)
        this.tab = tab
        if ((page === 1 && this.TItems.length > 0) || this.TItemsStop || this.listLoading) return
        page = page || this.TPage
        this.setPullLoad(true)
        this.listLoading = true
        api.common.getData(this.apiInterface.my_topic_list, {
          page: page
        }).then(this.filterCallback).then((res) => {
          if (res.errno === 0) {
            if (this.addItem(this.TItems, res.rsm) === 0 || res.rsm.length < 5) {
              this.TItemsStop = true
              this.setPullLoad(false)
            }
            this.TPage = page + 1
          }
          this.listLoading = false
        })
      },
      pay (item) {
        // console.log('in-pay', item)
        var self = this
        // var audio = document.getElementById('voice_audio')
        this.voiceAudio.pause()
        if (item.currentUrl === this.currentUrl) {
          self.currentUrl = ''
          return
        }
        // console.log('currentUrl', this.currentUrl)
        if (item.currentUrl) {
          this.currentUrl = item.currentUrl
          // audio.play()
          return
        }
        this.setState(true)
        var aid = item.answer_data ? item.answer_data.answer_id : item.data.answer_id
        this.answerPay(aid, (res) => {
          self.currentUrl = res.answer_url
          item.currentUrl = self.currentUrl
          if (self.machineType !== 'andriod') {
            setTimeout(() => {
              self.voiceAudio.play()
              self.setState(false)
            }, 500)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/home.styl'
  @import '../assets/stylus/_audio-list.styl'
</style>
