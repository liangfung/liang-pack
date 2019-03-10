# liang-pack
webpack-impr


## 手写一个简易版webpack的步骤

### 1. 收集依赖，构建依赖对象modules

1. 使用babylon将文件转化为ast，在ast中收集依赖
2. 模块id使用相对于process.cwd()的相对路径
3. 递归解析dependencies
4. 将依赖都放进一个hashMap

### 2. 构建 bundle文件的bootstrap

1. bundle文件为一个立即执行函数，参数为构建好的modules
2. 每个模块都用commonjs的风格包裹
3. 内建__webpack_require__函数作为模块包裹函数的require参数，用于加载构建好的模块依赖对象


## loader
loader就是一个函数，接收source，处理并返回
在读取模块代码后，匹配loader使用loader处理模块之后，再去解析(parse)模块

## plugin
plugin本质上是个带有apply方法的函数
在webpack中使用的是函数的实例方法，用于在webpack打包过程中不同的声明周期触发钩子回调函数