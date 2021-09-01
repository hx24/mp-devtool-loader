export function rewriteRequest (recorder) {
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