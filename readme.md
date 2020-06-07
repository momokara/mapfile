# 练习用小工具 列出指定目录的树,并且输出到指定文件

## 当前的命令是 mapfile

## 命令行使用

修改了在osx的问题
添加一个开关控制输出

```全局安装：npm install -g momokaralistfiles
输入: mapfile
```

## 项目中使用

```npm install momokaralistfiles
const { listFilemap, savefilemap, mapDir} = require('momokaralistfiles')

```

### 获取文件树 object

```/**
 * @description: 获取文件树
 * @param {string} dir 文件目录路径
 * @param {boolean} showlog 是否输出log
 * @return {object} 遍历的路径树
 */
listFilemap({dir})
```

### 获取并保存文件树

```/**
 * @param {string} dir 文件目录路径
 * @param {string} outputPath 输出文件路径
 */
savefilemap(dir, outputPath)
```

### 合并当前目录下的js文件

```let path = require('path')
let dir = path.join(__dirname,'.')
/**
 * @param {string} dir 文件目录路径
 */
module.exports = mapDir(dir)

```

```会读取 第一次遍历目录下的 fileMapConfig.json 文件 作为配置
fileInfo:文件说明; typeIcon：后缀类型的图标; banList:不遍历的文件夹;
{
  "fileInfo": {
    "data": "📁数据文件",
    "bin": "使用function"
  },
  "typeIcon": {
    "scss": "🍧",
    "file": "📁",
    "action": "📍",
    "reducers": "💾",
    "class": "🔖",
    "html": "📄",
    "d": "🚩",
    "png": "🎨",
    "tsx": "📜"
  },
  "banList": [
    "node_modules",
    "static",
    "dist"
  ]
}

```

data 文件夹下有一些配置可以修改
[github](https://github.com/momokara/mapfile)
