# 练习用小工具 列出指定目录的树,并且输出到指定文件

## 当前的命令是 mapfile

## 命令行使用

```
全局安装：npm install -g momokaralistfiles
输入: mapfile
```

## 项目中使用

```
npm install momokaralistfiles
const { listFilemap, savefilemap, mapDir} = require('momokaralistfiles')

```

### 获取文件树 object
```
/**
 * @description: 获取文件树
 * @param {string} dir 文件目录路径
 * @return {object} 遍历的路径树
 */
listFilemap(dir)
```

### 获取并保存文件树
```

/**
 * @param {string} dir 文件目录路径
 * @param {string} outputPath 输出文件路径
 */
savefilemap(dir, outputPath)
```

### 合并当前目录下的js文件
```
let path = require('path')
let dir = path.join(__dirname,'.')
/**
 * @param {string} dir 文件目录路径
 */
module.exports = mapDir(dir)

```

data 文件夹下有一些配置可以修改
[github](https://github.com/momokara/mapfile)
