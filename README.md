# 小程序乾坤袋

> 小程序调试工具

![埋点查看](https://qnm.hunliji.com/lhRqB54AAN3LCrC0rqBw3cPtpvAP)

## 使用方式

#### 安装依赖

```bash
npm i @weiyi/mp-devtool-loader --save-dev
```

#### 配置

该工具实际一个是 webpack 的 loader，uni-app 使用的 vue-cli，因此按照 vue-cli 配置 loader 的方式进行配置.[配置文档](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7).  
其底层使用的是 webpack-chain 的包,vue-cli 对其描述不够全,可查看[webpack-chain 官方文档](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)

修改 vue.config.js

```javascript
const path = require("path")
const sep = path.sep
const injectComponentRule = new RegExp(`\\${sep}pages\\${sep}[^\\${sep}]+\\${sep}index\\.vue$`) // 默认匹配 pages/**/index.vue， 待后续优化为支持设置字符串 '/pages/**/index.vue'的格式

// const injectComponentRule = new RegExp(`\\${sep}pages.+\\.vue$`) // 匹配pages下所有vue文件

module.exports = {
  chainWebpack: (config) => {
    // ...
    config.module
      .rule("mp-devtool") // 链式操作用来分组的名字
      .test(/\.(vue)|(js)$/)
      .pre()
      .exclude.add(/node_modules/)
      .end()
      .use("@weiyi/mp-devtool-loader")
      .loader("@weiyi/mp-devtool-loader")
      .options({
        injectComponentRule,
      })
  },
}
```

#### 配置 uni-app

注册 WyMpDevtool 为全局组件，修改 pages.json

```json
{
  // ...
  "easycom": {
    "autoscan": true,
    "custom": {
      "wy-mp-devtool": "WyMpDevtool/index.vue"
    }
  }
  // ...
}
```
