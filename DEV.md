# 开发文档

## 调试 loader

> 可使用任意基于 vue-cli 创建的项目（包括 uni-app），一下以 vue-demo 为项目名举例

### 配置 loader

给当前项目创建软链

```bash
npm link
```

在测试项目中链接

```bash
npm link @weiyi/mp-devtool-loader
```

修改 vue-demo/vue.config.js

```javascript
module.exports = {
  // ...
  chainWebpack: (config) => {
    config.module
      .rule("mp-devtool") // 链式操作用来分组的名字
      .test(/\.(vue)|(js)$/)
      .exclude.add(/node_modules/)
      .end()
      .use("@weiyi/mp-devtool-loader")
      .loader("@weiyi/mp-devtool-loader")
  },
}
```

### 配置 vscode debug

![vscode](https://qnm.hunliji.com/Fq9h9DtqNqPRw0PoXAPaZUvf_PVT?imageView2/1/w/200)

```javascript
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        "debug" // 对应package中scripts命令
      ],
      "port": 9229,
      "skipFiles": [
        "<node_internals>/**"
      ]
    }

  ]
}
```

在 package.json 的 scripts 添加命令

```json
"scripts": {
  "debug": "node --inspect=9229 ./node_modules/@vue/cli-service/bin/vue-cli-service serve",
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint"
},
```

按f5即可启动调试。


## 调试wy-mp-devtool组件
在uni-app中手动引入开发，开发完覆盖src/DevTool中的文件