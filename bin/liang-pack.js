#! /usr/bin/env node

const path =require('path')
const configPath = path.resolve('webpack.config.js')
const config = require(configPath)
const Compiler = require('../lib/Compiler')
const compiler = new Compiler(config)

compiler.run()