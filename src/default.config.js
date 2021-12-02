const path = require("path")

// const sep = path.sep
// const defaultInjectComponentRules = new RegExp(`\\${sep}pages\\${sep}[^\\${sep}]+\\${sep}index\\.vue$`) // 默认插入到
const injectComponentRule = []
const componentPath = path.resolve(__dirname, "./DevTool/WyMpDevtool")
const injectJsEntry = path.resolve("./src/main.js")
const pagesJsonPath = path.resolve("./src/pages.json")
const injectJsPath = path.resolve(__dirname, "./DevTool/WyMpDevtoolInit")

const schema = {
  type: "object",
  properties: {
    componentPath: {
      description: "要在全局注册的组件",
      type: "string",
    },
    componentName: {
      description: "自定义在template中自动插入的组件名, 默认为wy-mp-devtool",
      type: "string",
    },
    injectComponentRule: {
      anyOf: [
        {
          description: "需要自动插入组件的vue文件路径正则",
          instanceof: "RegExp", // TODO 正则不好写, 换成string形式,支持 /pages/**/index.vue的格式
        },
        {
          description: "需要自动插入组件的vue文件路径正则列表",
          type: "array", // TODO 正则不好写, 换成string形式,支持 /pages/**/index.vue的格式
        },
      ],
    },
    pagesJsonPath: {
      description: 'page.json路径, 默认为src/json',
      type: 'string'
    },
    injectJsEntry: {
      description: "要注入js的入口文件路径, 绝对路径",
      type: "string",
    },
    injectJsPath: {
      anyOf: [
        {
          description: "在入口文件中注入的js路径, 如重写wx.request, 绝对路径",
          type: "string",
        },
        {
          description: "在入口文件中注入的js文件路径列表, 如重写wx.request",
          type: "array",
        },
      ],
    },
  },
}

const defaultConfig = {
  componentPath,
  componentName: "wy-mp-devtool",
  // TODO 正则不配置 修改为支持直接设置 /pages/**/index.vue的格式.并支持数组
  injectComponentRule, // 默认匹配 pages/**/index.vue
  pagesJsonPath,
  injectJsEntry,
  injectJsPath,
}

module.exports = {
  defaultConfig,
  schema,
}
