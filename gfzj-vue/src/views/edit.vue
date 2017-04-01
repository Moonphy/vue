// 编辑页
<template>
  <div class="form bg-white">
    <form>
      <div class="form-row">
        <label class="font-pink">个人头衔</label>
        <input placeholder="请输入14字以内的头衔" type="text">
      </div>
      <div class="form-row">
        <label class="font-pink">个人介绍</label>
        <textarea placeholder="请输入60字以内个人介绍" type="text" rows="3"></textarea>
      </div>
      <div class="tc pl20 pr20 pb40">
        <input type="button" value="保存" class="btn btn-primary btn-block">
      </div>
    </form>
  </div>
</template>
<script>
  import { globalMixins } from 'src/mixins.js'
  export default {
    name: 'edit',
    mixins: [globalMixins],
    data () {
      return {

      }
    },
    ready () {

    },
    methods: {

    }
  }
</script>
<style lang="stylus">
  @import '../assets/stylus/publish.styl'
</style>
