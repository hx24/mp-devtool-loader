import Vue from 'vue'
import { STORAGE_KEY } from './constant'

export default class Recorder {
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
      if (records.length > 200) {
        records.splice(200) // 最多保留两百条数据
      }
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