<template>
  <h1>测试插件22222</h1>
</template>
<script>
export default {
  name: 'wy-mp-devtool',
  created () {
    alert('组件加载')
    console.log('created')
  }
}
</script>
<style scoped>
h1 {
  color: red;
}
</style>