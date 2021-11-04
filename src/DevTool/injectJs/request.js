import Vue from 'vue'

export function rewriteRequest (recorder) {
  var wxRequest = wx.request
  Object.defineProperty(wx, 'request', { writable: true })
  wx.request = function (options) {
    options = options || {}
    const id = recorder.addRecord(options)
    const _this = this
    const { complete } = options
    const startTime = +new Date()

    function _complete (...args) {
      typeof complete === 'function' && complete.apply(_this, args)
      recorder.addResponse(id, startTime, ...args)
    }

    setHeaders(options.header)
    setGatewayTag(options.header)
    return wxRequest.call(_this, { ...options, complete: _complete })
  }
}

function setHeaders (header) {
  header = header || {}
  setGatewayTag(header)
}

function setGatewayTag (header) {
  const store = Vue.prototype.$devToolStore
  const tag = store.get('gatewayTag')
  if (tag) {
    Object.assign(header, {
      'x-global-router-tag': tag
    })
  }
}
