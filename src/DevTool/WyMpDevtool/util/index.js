/**
 * 拖拽元素
 * :style="{'transform':`translate(${drag.x}px, ${drag.y}px)`}"
    @touchstart="e => drag.start(e)"
    @touchmove.stop.prevent="e => drag.move(e)"
    @touchend="e => drag.end(e)"
 */
export class ElDrag {
  constructor () {
    // 偏移距离
    this.x = 0
    this.y = 0
    // 当前坐标
    this.curPoint = {
      x: 0,
      y: 0
    }
    // 拖动原点
    this.startPoint = {}
    // 标志位（只触发点击事件按，并没有移动-就不必触发）
    this.isTouchMove = false
  }

  start (ev) {
    // console.log('start', ev);
    // 记录一开始手指按下的坐标
    const touch = ev.changedTouches[0]
    this.startPoint.x = touch.pageX
    this.startPoint.y = touch.pageY
  }

  move (ev) {
    // console.log('move',ev);
    /**
     * 防止页面高度很大，出现滚动条，不能移动-默认拖动滚动条事件
     * https://uniapp.dcloud.io/vue-basics?id=%e4%ba%8b%e4%bb%b6%e4%bf%ae%e9%a5%b0%e7%ac%a6
     * 使用修饰符处理（出现滚动条，用下面方方式依然可滚动）
     */
    // ev.preventDefault()
    // ev.stopPropagation()

    this.isTouchMove = true

    const touch = ev.changedTouches[0]
    const diffPonit = {} // 存放差值
    diffPonit.x = touch.pageX - this.startPoint.x
    diffPonit.y = touch.pageY - this.startPoint.y
    // 移动的距离 = 差值 + 当前坐标点
    this.x = diffPonit.x + this.curPoint.x
    this.y = diffPonit.y + this.curPoint.y
  }

  end (ev) {
    // console.log('end', ev);
    if (!this.isTouchMove) return

    //  更新坐标原点
    const touch = ev.changedTouches[0]
    this.curPoint.x += touch.pageX - this.startPoint.x
    this.curPoint.y += touch.pageY - this.startPoint.y

    // 重置
    this.isTouchMove = false
  }
}