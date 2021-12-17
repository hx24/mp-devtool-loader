const { injectComponents, injectJs, getOptions } = require("./utils")

module.exports = function (source) {
  // 默认情况下如果待处理文件未发生变化, 会使用缓存的loader处理结果, 调试loader时开启此项
  // this.cacheable(false);

  const options = getOptions(this)
  const resourcePath = this.resourcePath // 当前处理文件路径

  source = injectComponents(source, resourcePath, options)
  source = injectJs(source, resourcePath, options)
 
  return source
}