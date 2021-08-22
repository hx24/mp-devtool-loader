const { getOptions } = require("loader-utils")
const { validate } = require("schema-utils")
const { injectComponent, injectJs } = require("./utils")
const { defaultConfig, schema } = require("./default.config")

module.exports = function (source) {
  // 默认情况下如果待处理文件未发生变化, 会使用缓存的loader处理结果, 调试loader时开启此项
  this.cacheable(false);

  const config = { ...defaultConfig, ...getOptions(this) }
  validate(schema, config, { name: "@weiyi/mp-devtool-loader", baseDataPath: "options" })
  
  const resourcePath = this.resourcePath // 当前处理文件路径

  source = injectComponent(source, resourcePath, config)
  source = injectJs(source, resourcePath, config)
 
  return source
}