<template>
  <section class="component-mp-devtool-sider" :class="{ 'dev-tool-show': menuKey }">
    <div class="header">
      <div class="title">{{ title }}</div>
      <span class="close" @click="handleClose">×</span>
    </div>
    <div class="main">
      <monitor v-if="menuKey === 'monitor'"></monitor>
      <page-info v-if="menuKey === 'pageInfo'"></page-info>
    </div>
  </section>
</template>

<script>
import Monitor from './Monitor'
import PageInfo from './PageInfo'
import menus from '../menus'

export default {
  name: 'mp-devtool-sider',
  components: {
    Monitor,
    PageInfo
  },
  props: {
    menuKey: String
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
      this.$emit('update:menuKey', '')
    }
  },
  computed: {
    menusMap () {
      return menus.reduce((res, menu) => {
        res[menu.key] = menu
        return res
      }, {})
    },
    title () {
      return this.menusMap[this.menuKey]?.name
    }
  }
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
  right: 5px;
  font-size: 20px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main {
  overflow: auto;
}
</style>
