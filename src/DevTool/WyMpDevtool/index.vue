<template>
  <div class="container" v-if="devIconVisible">
    <div class="dev-icon" @click="handleDevIconClick">W</div>
    <div class="menus-container" :class="{ 'menus-container-show': menusVisible }">
      <ul class="menus">
        <li class="menu-item" @click="handleMenuClick(item.key)" v-for="item in menus" :key="item.key">
          <img class="menu-img" :src="item.icon" />
          <span class="menu-name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <sider :menu-key.sync="currentMenuKey"></sider>
  </div>
</template>
<script>
import Sider from './components/Sider.vue'
import menus from './menus'

export default {
  name: 'wy-mp-devtool',
  components: {
    Sider
  },
  data () {
    return {
      menus: menus,
      currentMenuKey: '',
      devIconVisible: true,
      menusVisible: false
    }
  },
  watch: {
    menusVisible () {}
  },
  methods: {
    handleDevIconClick () {
      if (this.currentMenuKey) {
        this.currentMenuKey = ''
      } else {
        this.menusVisible = !this.menusVisible
      }
    },
    handleMenuClick (key) {
      if (key === 'close') {
        this.menusVisible = false
        this.devIconVisible = false
        return
      }
      this.currentMenuKey = key
      this.menusVisible = false
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
  bottom: 100px;
  right: 10px;
}
.dev-icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.menus-container {
  position: absolute;
  right: -100%;
  width: 0;
  height: 0;
  opacity: 0;

  /* transition: all 0.3s ease 0s; */
  transition: width, height, opacity 0.3s ease 0s;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 20px;
}
.menus-container-show {
  width: 300px;
  height: 300px;
  opacity: 1;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
}
.menus {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
.menu-img {
  width: 35px;
  height: 35px;
}
.menu-item {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  white-space: nowrap;
  flex-direction: column;
  overflow: hidden;
  font-size: 14px;
}
</style>
