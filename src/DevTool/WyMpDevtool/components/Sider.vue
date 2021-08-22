<template>
  <section class="component-mp-devtool-sider" :class="{ 'dev-tool-show': name }">
    <div class="header">
      <div class="title">埋点查看</div>
      <span class="close" @click="handleClose">x</span>
    </div>
    <div class="main">
      <monitor v-if="name === 'monitor'"></monitor>
    </div>
  </section>
</template>

<script>
import Monitor from './Monitor'

export default {
  name: 'mp-devtool-sider',
  components: {
    Monitor
  },
  props: {
    name: String
  },
  data () {
    return {
      show: true
    }
  },
  mounted () {},
  created () {},
  methods: {
    handleClose () {
      this.$emit('update:name', '')
    }
  },
  computed: {}
}
</script>

<style scoped>
.component-mp-devtool-sider {
  position: fixed;
  background: #fff;
  height: 100%;
  width: 70%;
  left: -100%;
  top: 0;
  z-index: 99;
  color: #333;
  transition: left 0.3s ease;
  box-shadow: 0 2px 8px 0 rgb(52 56 75 / 20%);
  word-break: break-all;
  margin-bottom: 10px;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.dev-tool-show {
  left: 0;
}
.header {
  font-size: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #efefef;
}
.close {
  position: absolute;
  right: 15px;
  font-size: 20px;
}
.main {
  overflow: auto;
}
</style>
