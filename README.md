# 小程序乾坤袋

> 小程序调试工具

![功能描述](https://qnm.hunliji.com/FvSDNGrxBACqQPDKU7LMEXUceTNr?imageView2/2/w/250)

![埋点查看](https://qnm.hunliji.com/Fl7myHyENLRklxiGgy0Ze2HJ5d9u?imageView2/2/w/250)

## 使用方式

### 1.安装依赖

```bash
npm i @weiyi/mp-devtool-loader --save-dev
```

### 2.修改vue.config.js
> 注意区分环境，只在非正式环境注入


```javascript
const { BUILD_TYPE = '' } = process.env

module.exports = {
  chainWebpack: (config) => {
    // ...
    if (BUILD_TYPE !== '体验版') { // 注意区分环境，根据项目实际情况配置
      config.module
        .rule('mp-devtool') // 链式操作用来分组的名字
        .test(/\.(vue)|(js)$/)
        .pre()
        .exclude.add(/node_modules/)
        .end()
        .use('@weiyi/mp-devtool-loader')
        .loader('@weiyi/mp-devtool-loader')
        .options({})
    }
  },
}
```

该工具实际一个是 webpack 的 loader，uni-app 使用的 vue-cli，因此按照 vue-cli 配置 loader 的方式进行配置.[配置文档](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7).  
其底层使用的是 webpack-chain 的包,vue-cli 对其描述不够全,可查看[webpack-chain 官方文档](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)



### 3.注册全局组件

注册 WyMpDevtool 为全局组件，修改 src/pages.json

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "wy-mp-devtool": "WyMpDevtool/index.vue"
    }
  }
}
```

配成完成后启动项目即可


### 工作原理
在入口js文件中初始化（重写wx.request等），在全局注册wy-mp-devtool组件，根据page.json，在编译时对每个页面文件中的template文件中插入wy-mp-devtool组件的调用。

源文件
```vue
<template>
  <div>
    hello
  </div>
</template>
<script>
 // ...
</script>
```

编译时经loader处理后
```vue
<template>
  <div><wy-mp-devtool></wy-mp-devtool>
    hello
  </div>
</template>
<script>
 // ...
</script>
```

### 选项

#### pagesJsonPath
pages.json文件的绝对路径，以该文件里的配置判断是否为页面级vue，给其注入组件调用。默认为src/pages.json

#### injectComponentRule
pages.json不满足需求时，可以配置injectComponentRule，接收正则数组。

