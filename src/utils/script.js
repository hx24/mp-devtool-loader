const path = require("path")
const acorn = require("acorn")
const estraverse = require("estraverse")
const escodegen = require("escodegen")
const { copyDirOnceSync } = require("./file")

// TODO 包名提出来
const packageName = "wyMpDevtoolInit"

/**
 * 拷贝js文件到node_modules下
 * @param {string | string[]} jsPaths 待拷贝js文件路径
 * @param {string} target
 */
function copyJsFiles(jsPaths) {
  // TODO 暂时只考虑单文件插入
  copyDirOnceSync(jsPaths, path.resolve(`./node_modules/${packageName}`))

  // if (typeof jsPaths === 'string') {
  //   copyDirOnceSync(jsPaths, path.resolve(`./node_modules/${packageName}`))
  // } else if (Array.isArray(jsPaths)) {
  //   // TODO 多个文件时这样直接拷贝有问题，全都拷贝到了同一目录下，若文件相互依赖会发生错误
  //   jsPaths.forEach(path => copyJsFiles(path))
  // }
}

function injectImportDeclaration(source) {
  const sourceAst = acorn.parse(source, { sourceType: "module", ecmaVersion: 2020 })
  let lastNode = null
  estraverse.traverse(sourceAst, {
    leave: function (node, parent) {
      if (node.type == "ImportDeclaration") {
        lastNode = node
      }
    },
  })
  const lastImportDeclarationIndex = sourceAst.body.indexOf(lastNode) // 最后一个ImportDeclaration的索引
  const importCode = `import '${packageName}'`
  const importAst = acorn.parse(importCode, { sourceType: "module" })

  sourceAst.body.splice(lastImportDeclarationIndex + 1, 0, importAst)
  const newSource = escodegen.generate(sourceAst)
  return newSource
}

/**
 * 拷贝待插入js文件到node_modules下，并在入口中引用
 * @param {string} source 入口文件源码
 * @param {string} resourcePath 当前解析的文件的路径
 * @param {object} config loader配置
 * @param {string} config.injectJsEntry 入口文件路径，默认main.js
 * @param {string} config.injectJsPath 要在入口注入的js文件路径
 */
function injectJs(source, resourcePath, config) {
  const { injectJsEntry, injectJsPath } = config
  // TODO 优化路径匹配方式
  if (injectJsEntry.toLowerCase() === resourcePath.toLowerCase()) {
    copyJsFiles(injectJsPath)
    source = injectImportDeclaration(source)
  }
  return source
}

module.exports = {
  injectJs,
}
