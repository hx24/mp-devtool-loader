import Vue from 'vue'
import { REQUESTS_STORAGE_KEY, RESPONSES_STORAGE_KEY } from './constant'

export default class Recorder {
  constructor () {
    this.checkStorageSize()
    this.bus = new Vue()
  }

  addRecord (options) {
    try {
      const records = this.getAll()
      const record = this.formatRequest(options)
      records.unshift(record)
      // if (records.length > 100) {
      //   records.splice(100) // 最多保留100数据
      // }
      wx.setStorageSync(REQUESTS_STORAGE_KEY, records)
      this.bus.$emit('update', records)
      return record.id
    } catch (error) {
      console.error(error)
    }
  }

  updateRecord (id, options) {
    try {
      const records = this.getAll()
      const record = records.find(record => record.id === id)
      if (record) {
        Object.assign(record, options)
        wx.setStorageSync(REQUESTS_STORAGE_KEY, records)
        this.bus.$emit('update', records)
      }
      console.log('update', options)
    } catch (error) {
      console.error(error)
    }
  }

  getAll () {
    let records = []
    try {
      records = wx.getStorageSync(REQUESTS_STORAGE_KEY) || []
      if (typeof records === 'string') {
        // 兼容遗留问题
        records = JSON.parse(records)
      }
    } catch (error) {
      console.error(error)
    }
    return records
  }

  formatRequest (options) {
    let { url, data, header, method, dataType } = options
    const id = Date.now()
    const reqDataType = typeof data
    if (data && reqDataType !== 'string' && reqDataType !== 'object') {
      data = '非文本或json'
    }

    return {
      url,
      data,
      header,
      method,
      dataType,
      id
    }
  }

  clear () {
    this.bus.$emit('update', [])
    Recorder.clearStatic()
  }

  static clearStatic () {
    wx.removeStorageSync(REQUESTS_STORAGE_KEY)
    wx.removeStorageSync(RESPONSES_STORAGE_KEY)
  }

  checkStorageSize () {
    try {
      const { currentSize, limitSize } = wx.getStorageInfoSync()
      if (currentSize > limitSize * 0.5) {
        const records = this.getAll()
        // 删除一半数据
        const deletedRecords = records.splice(records.length / 2)
        const allResponse = wx.getStorageSync(RESPONSES_STORAGE_KEY) || {}
        deletedRecords.forEach(record => {
          delete allResponse[record.id]
        })
        wx.setStorageSync(REQUESTS_STORAGE_KEY, records)
        wx.setStorageSync(RESPONSES_STORAGE_KEY, allResponse)
        this.bus.$emit('update', records)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  addResponse (id, startTime, res) {
    // 对request的成功回调进行切片，记录响应值
    try {
      const allResponse = wx.getStorageSync(RESPONSES_STORAGE_KEY) || {}
      const response = JSON.parse(JSON.stringify(res))
      this.updateRecord(id, {
        time: +new Date() - startTime,
        status: response.statusCode
      })
      allResponse[id] = response
      wx.setStorageSync(RESPONSES_STORAGE_KEY, allResponse)
      this.checkStorageSize()
    } catch (error) {
      console.error('格式化响应失败', error)
    }
  }

  getResponse (id) {
    try {
      const allResponse = wx.getStorageSync(RESPONSES_STORAGE_KEY) || {}
      return allResponse[id]
    } catch (error) {
      console.error('读取相应失败', error)
      return {}
    }
  }
}
