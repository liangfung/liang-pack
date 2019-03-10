/**
 * 最终bundle文件的示例
 * 从entry文件开始，在执行时加载依赖模块
 */

var modules = {}
var entryId = ''

  (function (modules) {  // webpack bootstrap webpack的启动入口
    // 模块加载缓存
    var installedModules = {}
    // 自定义的require函数，使之可以在client端运行
    // 代替babel转化后的commonjs风格的模块的require
    function __webpack_require__(moduleId) {
      // check if module is cached
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports
      }
      // 没有installed并执行过
      // create a new module，并放进缓存里面
      var module = installedModules[moduleId] = {
        exports: {}
      }
      // 将新建的module作为模块的上下文的this值
      // 执行模块函数(模块已经被包裹成函数)，并返回已经被挂载了新exports的内建的module
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
      return module.exports
    }
    return __webpack_require__(entryId)
  })
  /************************************************************************/
  (
    {
      modules
    }
  )