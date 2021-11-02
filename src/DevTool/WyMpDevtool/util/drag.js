/**
 * 拖拽元素
 * :style="{'transform':`translate(${drag.x}px, ${drag.y}px)`}"
    @touchstart="e => drag.start(e)"
    @touchmove.stop.prevent="e => drag.move(e)"
    @touchend="e => drag.end(e)"
 */

export class ElDrag {
  constructor (menuRef) {
    // this.menuRef = menuRef 会报错
    Object.defineProperty(this, 'menuRef', {
      value: menuRef,
      writable: false
    })

    this.getRefInfo().then(data => {
      const { width, height, left, top } = data
      this.width = width
      this.height = height
      this.left = left
      this.top = top
    })

    uni.getSystemInfo({
      success: info => {
        this.windowWidth = info.windowWidth
        this.windowHeight = info.windowHeight
      }
    })

    // 偏移距离
    this.x = 0
    this.y = 0

    // 当前坐标
    this.curPoint = {
      x: 0,
      y: 0
    }
    // 拖动原点(相对位置，相对自身)
    this.startPoint = {}
  }

  start (ev) {
    // 记录一开始手指按下的坐标
    const touch = ev.changedTouches[0]
    this.startPoint.x = touch.pageX
    this.startPoint.y = touch.pageY

    this.curPoint.x = this.x
    this.curPoint.y = this.y
  }

  async move (ev) {
    /**
     * 防止页面高度很大，出现滚动条，不能移动-默认拖动滚动条事件
     * https://uniapp.dcloud.io/vue-basics?id=%e4%ba%8b%e4%bb%b6%e4%bf%ae%e9%a5%b0%e7%ac%a6
     * 使用修饰符处理（出现滚动条，用下面方方式依然可滚动）
     */
    // ev.preventDefault()
    // ev.stopPropagation()

    const touch = ev.changedTouches[0]
    const diffPoint = {} // 存放差值
    diffPoint.x = touch.pageX - this.startPoint.x
    diffPoint.y = touch.pageY - this.startPoint.y
    // 移动的距离 = 差值 + 当前坐标点
    this.x = diffPoint.x + this.curPoint.x
    this.y = diffPoint.y + this.curPoint.y
  }

  /**
   * 获取当前拖拽元素的信息
   * @returns {Promise<Object>}
   */
  getRefInfo () {
    return new Promise(resolve => {
      this.menuRef
        .boundingClientRect(data => {
          resolve(data)
        })
        .exec()
    })
  }

  end (ev) {
    this.moveToSide()
  }

  /**
   * 移动到边界
   */
  async moveToSide () {
    const refInfo = await this.getRefInfo()
    const { width, height, left, top } = refInfo
    const { windowWidth, windowHeight } = this

    if (left + width / 2 < windowWidth / 2) {
      // 移动到左边界
      this.x -= left
    } else {
      // 移动到右边界
      this.x += (windowWidth - left - width)
    }

    if (top < 0) {
      // 移动到上边界
      this.y -= top
    } else if (top + height > windowHeight) {
      // 移动到下边界
      this.y += (windowHeight - top - height)
    }
  }
}
