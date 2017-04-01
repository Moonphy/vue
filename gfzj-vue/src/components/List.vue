<template>
  <div :class="['lists', extcs]">
    <ul class="" v-el="wrap">
      <li v-for="item in items" class="item" :class="[showObj.currentUrl === item.topic_voice_url ? 'item-play' : '']">
        <a v-link="{path:'/detail?tid='+item.topic_id}">
          <div class="ui-avatar fl">
            <img :src="item.topic_cover_url_big">
            <div class="ui-label label-black">{{item.question_num || 0}}提问</div>
            <slot name="music_state">
            </slot>
          </div>
          <div class="item-content">
            <div class="item-title">
              <span class="ui-label label-orange">最新</span>
              <strong>{{item.topic_name || item.title}}</strong>
            </div>
            <div class="tr font-grey content-bottom font-sm">
              <span class="fl" v-if="showExpert">专家：{{item.expert || item.user_name}}</span>
              <span>{{item.add_time | timestampToday}}</span>
            </div>
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
      type: Object
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
