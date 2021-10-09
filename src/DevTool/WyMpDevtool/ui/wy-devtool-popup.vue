<template>
  <div class="wy-devtool-popup" v-show="value">
    <div v-if="height !== '100%'" class="wy-devtool-popup__mask" @click="handleClose"></div>
    <div :class="['wy-devtool-popup__container', position]" :style="{ height: height }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '80%'
    },
    position: {
      type: String,
      default: 'bottom'
    }
  },
  watch: {
    value (val) {
      this.$emit('change', val)
    }
  },
  methods: {
    handleClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style>
.wy-devtool-popup__mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 300;
}
.wy-devtool-popup__container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 301;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  background: #FFFFFF;
}
.wy-devtool-popup__container.bottom {
  top: auto;
}
.wy-devtool-popup__container.top {
  bottom: auto;
}
</style>
