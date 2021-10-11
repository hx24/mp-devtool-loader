<template>
  <div class="container">
    <div class="dev-icon" @click="showPopup = true">W</div>
    <wy-devtool-popup v-model="showPopup">
      <div class="wy-mp-devtool__wrapper">
        <div class="menus__container">
          <ul class="menus">
            <li
              v-for="menu in menus"
              :key="menu.key"
              :class="['meun-item', { actived: menu.key === curMenu.key }]"
              @click="handleMenuClick(menu)"
            >{{ menu.key }}</li>
          </ul>
        </div>
        <div class="main__container">
          <monitor v-show="curMenu.key === 'Monitor'"></monitor>
          <page-info v-show="curMenu.key === 'Page'"></page-info>
        </div>
      </div>
    </wy-devtool-popup>
  </div>
</template>
<script>
import WyDevtoolPopup from './ui/wy-devtool-popup.vue'
import Monitor from './components/Monitor.vue'
import PageInfo from './components/PageInfo.vue'

import menus from './menus.js'

export default {
  name: 'wy-mp-devtool',
  components: {
    WyDevtoolPopup,
    Monitor,
    PageInfo
  },
  data () {
    return {
      menus: menus,
      showPopup: false,
      curMenu: menus[0] || {}
    }
  },
  methods: {
    handleMenuClick (menu = {}) {
      this.curMenu = menu
    }
  }
}
</script>
<style scoped>
.container {
  z-index: 99999;
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  bottom: 200px;
  right: 10px;
}
.dev-icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wy-mp-devtool__wrapper {
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 14px;
  height: 100%;
  overflow: hidden;
}
.menus {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}
.meun-item {
  height: 35px;
  line-height: 35px;
  padding: 0 5px;
  border-right: 1px solid #e4e7ed;
  list-style: none;
  background: #f5f7fa;
}
.meun-item.actived {
  background: #fff;
}
.main__container {
  flex: 1;
  overflow: hidden;
}
</style>
