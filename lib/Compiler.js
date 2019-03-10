const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
const ejs = require('ejs')

class Compiler {
  constructor(config) {
    this.config = config
    this.modules = {}
    this.entryId = null
    this.entry = config.entry
    this.root = process.cwd()
  }

  getSource(path) {
    return fs.readFileSync(path, 'utf-8')
  }
  /**
   * 构建模块
   * @param {string} modulePath 
   * @param {boolean} isEntry 
   */
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath)
    let moduleId = './' + path.relative(this.root, modulePath)
    let { parsedSource, dependencies } = this.parse(source, path.dirname(moduleId))
    if (isEntry) {
      this.entryId = moduleId
    }
    this.modules[moduleId] = parsedSource
    dependencies.forEach(o => {
      this.buildModule(path.resolve(this.root, o), false)
    })
  }
  /**
   * 编译模块并返回
   * @param {string} source 
   * @param {string} parentPath 
   */
  parse(source, parentPath) {
    // 将一个源文件代码转成ast
    let ast = babylon.parse(source)
    // 该文件中的所有依赖
    let dependencies = []
    // 遍历ast
    traverse(ast, {
      CallExpression(p) {
        let { node } = p
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleId = node.arguments[0].value
          moduleId = moduleId + (path.extname(moduleId) ? '' : '.js')
          moduleId = './' + path.join(parentPath, moduleId)
          node.arguments = [t.stringLiteral(moduleId)]
          // 将该文件中的所有依赖的相对路径push到依赖中
          dependencies.push(moduleId)
        }
      }
    })
    // 将遍历修改后的ast转为code并返回
    let parsedSource = generator(ast).code
    return {
      parsedSource,
      dependencies
    }
  }
  /**
   * 最终生成bundle文件
   */
  emitFile() {
    let { filename, path: outputPath } = this.config.output
    let template = this.getSource(path.resolve(__dirname, './template.ejs'))
    let code = ejs.render(template, { entryId: this.entryId, modules: this.modules })
    let mainPath = path.resolve(outputPath, filename)
    fs.writeFileSync(mainPath, code)
  }

  run() {
    // 解析依赖，递归收集依赖，构建依赖表
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 使用模板生成文件（构造的__webpack_require__函数，在加载已经转化为commmonjs风格的代码）
    // 喷出结果
    this.emitFile()
  }

}

module.exports = Compiler