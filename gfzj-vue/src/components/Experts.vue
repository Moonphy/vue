<template>
  <div>
    <ul class="" v-el="wrap">
      <li v-for="item in items" class="item">
        <a v-link="{path:'/detail?tid='+item.topic_id}">
          <div class="ui-avatar fl">
            <img :src="item.avatar_file">
          </div>
          <div class="item-content">
            <div class="item-title">
              <strong>{{item.user_name}}</strong>
              <div class="fr font-grey-lither">
                <span class="font-pink">{{item.fans_count}}关注</span>
                |
                <span class="font-pink"> {{item.specialist_topic_count || item.topic_num}}个方法</span>
              </div>
            </div>
            <div class="ablum-brief font-grey">{{item.introduction}}</div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      'items': {
        type: Array
      },
      'extcs': {
        type: String,
        default: ''
      },
      'showExpert': {
        type: Boolean,
        dafault: true
      },
      'showObj': {
        type: Object,
        dafault: true
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/_audio-list.styl'
  _transition()
    -webkit-transition arguments[0] arguments[1]
    -moz-transition arguments[0] arguments[1]
    -o-transition arguments[0] arguments[1]
    transition arguments[0] arguments[1]
</style>