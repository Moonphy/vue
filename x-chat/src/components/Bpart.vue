<template>
  <div>
    <p>我是Bpart</p>
    <a v-on:click="goPage">点我切换</a>
  </div>
</template>

<script>
export default {
  name: 'test',
  methods: {
    goPage: function () {
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  color: red;
}
div {
  width: 100%;
  height: 100px;
  background-color: yellow;
}
</style>
