import Vue from 'vue'
import WyMpDevtool from 'WyMpDevtool'
// TODO 使用模板根据config设置组件
Vue.component('WyMpDevtool', WyMpDevtool)

let recorder = null

function rewriteRequest () {
  var wxRequest = wx.request
  Object.defineProperty(wx, 'request', { writable: true })
  wx.request = function (options) {
    options = options || {}
    const id = recorder.add(options)
    const _this = this
    const { complete } = options

    function _complete (...args) {
      // TODO 响应结束调用update，记录响应值
      !id && console.log('id', id)
      typeof complete === 'function' && complete.apply(_this, args)
      recorder.update(id)
    }

    return wxRequest.call(_this, { ...options, complete: _complete })
  }
}

const STORAGE_KEY = 'wy_mp_devtool_requests'
class Recorder {
  constructor () {
    const { currentSize, limitSize } = wx.getStorageInfoSync()
    if (currentSize > limitSize * 0.9) {
      this.clearHalf()
    }
    this.bus = new Vue()
  }

  add (options) {
    try {
      const records = this.getAll()
      const record = this.formatRequest(options)
      records.unshift(record)
      wx.setStorageSync(STORAGE_KEY, JSON.stringify(records))
      this.bus.$emit('update', records)
      return record.id
    } catch (error) {
      console.error(error)
    }
  }

  getAll () {
    let records = []
    try {
      records = JSON.parse(wx.getStorageSync(STORAGE_KEY) || '[]')
    } catch (error) {
      console.error(error)
    }
    return records
  }

  getTime () {
    const fix = num => {
      return num < 10 ? '0' + num : num
    }
    const date = new Date()
    const time = `${fix(date.getHours())}:${fix(date.getMinutes())}:${fix(
      date.getSeconds()
    )}`
    return time
  }

  formatRequest (options) {
    let { url, data, header, method, dataType } = options
    const time = this.getTime()
    const id = Date.now()

    const reqDataType = typeof data
    if (data && reqDataType !== 'string' && reqDataType !== 'object') {
      data = '非文本或json'
    }

    return {
      url,
      data,
      time,
      header,
      method,
      dataType,
      id
    }
  }

  clear () {
    this.bus.$emit('update', [])
    wx.removeStorageSync(STORAGE_KEY)
  }

  clearHalf () {
    const records = this.getAll()
    // 删除一半数据
    records.splice(records.length / 2)
    wx.setStorageSync(STORAGE_KEY, JSON.stringify(records))
    this.bus.$emit('update', records)
  }

  update (id) {
    // TODO 对request的成功回调进行切片，记录响应值
  }
}

recorder = Vue.prototype.$recorder = new Recorder()
rewriteRequest()

console.log('WyMpDevtool初始化成功')
