const { getOptions: _getOptions } = require("loader-utils")
const { validate } = require("schema-utils")
const { defaultConfig, schema } = require("../default.config")

/**
 * 获取loader选项
 * @param {object} ctx 
 * @returns {object}
 */
function getOptions(ctx) {
  const userOptions = _getOptions(ctx) || {}
  validate(schema, userOptions, { name: "@weiyi/mp-devtool-loader", baseDataPath: "options" })
  const components = userOptions.components ? [...defaultConfig.components, ...userOptions.components] : defaultConfig.components
  const scripts = userOptions.scripts ? [...defaultConfig.scripts, ...userOptions.scripts] : defaultConfig.scripts
  return {
    ...defaultConfig,
    ...userOptions,
    components,
    scripts
  }
}
module.exports = {
  getOptions
}