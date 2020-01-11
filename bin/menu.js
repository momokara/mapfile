#!/usr/bin/env node

// 加个运行目录方便调用
let inquirer = require('inquirer');
const path = require('path');

const { savefilemap } = require('./dirTools');

// 一级菜单
let menus = [
  {
    name: 'todo',
    message: '你要干啥',
    type: 'rawlist', // 有序列表有个数
    choices: [
      { name: '获取目录树', value: 'getTree' },
      { name: '没事', value: 'nothing' }],
    default: 0
  }
]



const logmenu = () => {
  showMenu(menus).then(res => {
    switch (res.todo) {
      case 'getTree':
        let dir = path.resolve('./');
        let output = path.resolve('./','FILEMAP.md');
        // 获取文件列表需要的信息
        let getFileTreeMenu = [
          { message: '要查看的文件目录(以~开头会替换成 [当前命令行目录/])', name: 'dir', default: dir },
          { message: '输出地址(以~开头会替换成命令行显示的路径,带斜杠)', name: 'output', default: output }
        ]
        showMenu(getFileTreeMenu).then(res => {
          let _useDir = res.dir;
          let _useOutputPath = res.output;
          _useDir = _useDir.replace(/^\~/, `${path.resolve('./')}/`);
          _useOutputPath = _useOutputPath.replace(/^\~/, `${path.resolve('./')}/`);
          savefilemap(_useDir, _useOutputPath);
        })
        break
      case 'nothing':
        process.exit();
      default:
        break
    }
  })
}

const showMenu = (menus) => {
  return inquirer.prompt(menus);
}

module.exports = {
  logmenu
}
