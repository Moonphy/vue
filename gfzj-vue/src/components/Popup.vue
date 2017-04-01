<template>
  <div v-if="show" transition="modal" class="modal">
    <div class="ui-mask"></div>
    <div class="modal-wrapper">
      <div class="mask-close" @click="closePopup"></div>
      <div :style="dialogStyle" class="modal-dialog">
        <div class="modal-header">
          <slot name="header">
            <h3>提示</h3>
          </slot>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <slot name="footer"></slot><span @click="closePopup" class="fa fa-times-circle"></span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      'message': {
        type: String
      },
      'show': {
        type: Boolean
      }
    },
    data () {
      return {

      }
    },
    methods: {
      closePopup () {
        this.$dispatch('popupclose')
        this.show = false
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../assets/stylus/_mask.styl'
  .modal
    transition opacity .2s ease
  // 浮层动画
  .modal-enter
  .modal-leave
    opacity 0
  .modal-enter .modal-dialog
  .modal-leave .modal-dialog
    transform scale(1.3)
</style>