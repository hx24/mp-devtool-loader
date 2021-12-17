const path = require("path")

// const sep = path.sep
// const defaultInjectComponentRules = new RegExp(`\\${sep}pages\\${sep}[^\\${sep}]+\\${sep}index\\.vue$`) // 默认插入到
const injectComponentRule = []
const components = [{ path: '@weiyi/mp-devtool-loader/src/DevTool/index.vue', name: 'WyDevTool' }]
const scripts = ["@weiyi/mp-devtool-loader/src/DevTool/scripts"]
const injectJsEntry = path.resolve("./src/main.js")
const pagesJsonPath = path.resolve("./src/pages.json")
const injectJsPath = path.resolve(__dirname, "./DevTool/WyMpDevtoolInit")

const schema = {
  type: "object",
  properties: {
    // componentPath: {
    //   description: "要在main.js中全局注册的组件路径(可以是npm包或相对main.js的相对路径)、组件名, 如[{ path: \"wy-dev-tool\", name: \"wy-dev-tool\" }]",
    //   type: "array",
    // },
    components: {
      description: "要自动插入的组件路径(可以是npm包或相对main.js的相对路径)、组件名, 如[{ path: \"wy-dev-tool\", name: \"wy-dev-tool\" }]",
      type: "array",
    },
    scripts: {
      description: "在入口文件中注入的js文件路径列表, 可以是npm包或相对main.js的相对路径, 如：[\"dev-tool/init.js\"]",
      type: "array",
    },
    // componentName: {
    //   description: "自定义在template中自动插入的组件名, 默认为wy-mp-devtool",
    //   type: "string",
    // },
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
      description: 'pages.json路径, 默认为src/pages.json',
      type: 'string'
    },
    injectJsEntry: {
      description: "要注入js的入口文件路径, 绝对路径, 默认为src/main.js",
      type: "string",
    },
    // injectJsPath: {
    //   description: "在入口文件中注入的js文件路径列表, 可以是npm包或相对main.js的相对路径, 如：[{ path: \"dev-tool/init.js\" }]",
    //   type: "array",
    // },
  },
}

const defaultConfig = {
  // componentPath,
  components,
  scripts,
  // componentName: "wy-mp-devtool",
  // TODO 使用minimatch优化 支持/pages/**/index.vue的格式.并支持数组
  injectComponentRule, // 默认匹配 pages.json中声明的路由
  pagesJsonPath,
  injectJsEntry,
  injectJsPath,
}

module.exports = {
  defaultConfig,
  schema,
}
