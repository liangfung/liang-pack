/**
 * 最终bundle文件的示例
 * 从entry文件开始，在执行时加载依赖模块
 */

var modules = {}
var entryId = ''

  (function () {
    // 模块加载缓存
    var installedModules = {}
    // 自定义的require函数，使之可以在client端运行
    // 代替babel转化后的commonjs风格的模块的require
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports
      }
      // 没有installed并执行过，就新建一个放进缓存里面
      var module = installedModules[moduleId] = {
        exports: {}
      }
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
      return module.exports
    }
    return __webpack_require__(entryId)
  })(
    {
      modules
    }
  )