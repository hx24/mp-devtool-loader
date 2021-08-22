const path = require("path")
const fs = require("fs")
const acorn = require("acorn")
const estraverse = require("estraverse")
const escodegen = require("escodegen")

const source = fs.readFileSync(path.resolve(__dirname, "./main.js")).toString()

const sourceAst = acorn.parse(source, { sourceType: "module" })

let lastNode = null

estraverse.traverse(sourceAst, {
  leave: function (node, parent) {
    if (node.type == "ImportDeclaration") {
      lastNode = node
    }
  },
})

const lastImportDeclarationIndex = sourceAst.body.indexOf(lastNode) + 1

const importCode = `import 'abc/index.js'`
const importAst = acorn.parse(importCode, { sourceType: "module" })

sourceAst.body.splice(lastImportDeclarationIndex, 0, importAst)
const code = escodegen.generate(sourceAst)
console.log(code)
