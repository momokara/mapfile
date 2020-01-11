#!/usr/bin/env node
const commander = require('commander');
const program = new commander.Command();

let { version } = require('./package.json')
console.log(version)
// 预处理下参数
program
  .version(version)
  .on('--help', function () {
    console.log('没写参数,帮助也没用的 ☺')
  })
  .parse(process.argv)

const { logmenu } = require('./bin/menu')
logmenu()
