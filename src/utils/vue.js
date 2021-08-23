const compiler = require("@vue/compiler-sfc")
const path = require("path")
const { pathRulesTest } = require("./path")
const { copyDirOnceSync } = require("./file")

/**
 * 驼峰转连字符 -
 * @param {string}} name
 */
function humpToHyphen(name) {
  return name.replace(/([A-Z])/g, "-$1").toLowerCase()
}

/**
 * 在vue文件的template中第一个非template节点下插入组件的调用
 * @param {string} source vue文件(SFC)源码
 * @param {string} componentName 组件名
 */
function inject(source, componentName) {
  componentName = humpToHyphen(componentName)
  const { descriptor } = compiler.parse(source)
  if (descriptor.template) {
    // TODO 暂未考虑没有只有一个自闭和标签的情况
    // 如:  <template><img/></template>
    const matchTags = source.match(/<[^\/>]+>/g)
    const tag =
      matchTags &&
      matchTags.find(
        (item) =>
          !item.includes("<template") &&
          !item.includes("<script") &&
          !item.includes("<style") &&
          !item.includes("<!") // 注释也是标签
      )
    if (tag) {
      source = source.replace(new RegExp(tag), `$&<${componentName}></${componentName}>`)
    }
  }
  return source
}

/**
 * 获取组件包名
 * @param {string} componentPath
 * @returns string
 */
function getComponentPkgName(componentPath) {
  return path.basename(componentPath)
}

/**
 * 拷贝Vue组件到node_modules下，并在vue文件的template中第一个非template节点下插入组件的调用
 * @param {string} source vue文件(SFC)源码
 * @param {string} resourcePath 当前解析的文件的路径
 * @param {object} config loader配置
 * @param {string} config.injectComponentRule 需要自动插入组件的vue文件路径正则
 * @param {string} config.pagesJsonPath page.json文件地址
 * @param {string} config.componentName 在template中自动插入的组件名
 */
function injectComponent(source, resourcePath, config) {
  const { componentPath, injectComponentRule, pagesJsonPath, componentName } = config

  // 将要插入的组件复制到node_modules下,避免git提交
  const packageName = getComponentPkgName(componentPath)
  copyDirOnceSync(componentPath, path.resolve(`./node_modules/${packageName}`))

  // 插入组件调用
  const isSFC = path.extname(resourcePath).includes("vue")
  const pathMath = pathRulesTest(resourcePath, { regRules: injectComponentRule, pagesJsonPath })
  if (isSFC && pathMath) {
    source = inject(source, componentName)
  }
  return source
}

module.exports = {
  getComponentPkgName,
  injectComponent,
}
