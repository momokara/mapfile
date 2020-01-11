const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const { color } = require('node_echocolor')

const { fileInfo, typeIcon, banList } = require('../data/fileMapData.json')
/**
 * @description: 获取文件树
 * @param {string} dir 文件目录路径
 * @param {string[]} parents 父级填充的内容
 * @param {number} fileLength 显示的宽度
 * @return {object} 遍历的路径树
 */
let firstRun = true; // listFilemap首次执行
let output = '';
async function listFilemap({
  dir = path.resolve(__dirname, '..', 'src'),
  parents = [] },
  fileLength = 65
) {
  let _objRes = {
    dir: dir,
    childFiles: [],
    children: {}
  };

  if (firstRun && isFile(dir)) { return console.error(color().add('red').echo(`${dir}: 不是文件夹`)) }
  // 读取目录下的文件夹
  let files = fs.readdirSync(dir, (err, files) => {
    return files;
  });
  if (firstRun) {
    let fileNames = dir.split('\\')
    // 写的第一行内容
    output = `文件目录:\n~${fileNames[fileNames.length - 1]}\n`;
  }
  firstRun = false;
  // 遍历文件
  await files.forEach(async (file, index) => {
    let tempdir = `${dir}\\${file}`;
    if (isBan(tempdir)) {
      return console.info(`${tempdir} 在禁止遍历列表不处理`)
    }
    // 文件是否是结尾
    let isEnd = index === files.length - 1
    // 显示的行内容
    let dirDeepShow = parents.reduce((total, cur) => {
      return ` ${cur}   ` + total
    }, (isEnd ? ' └── ' : ' ├── '))
    // 介绍的内容
    let descInfo = ' '
    // 填充的图标
    let fillIcon = ' '
    try {
      // 常识更新文件说明
      if (fileInfo[file]) {
        descInfo = fileInfo[file]
      } else if (isFile(tempdir)) {
        descInfo = fs.readFileSync(tempdir, 'utf-8')
        descInfo = descInfo.split('@description:')
        descInfo = descInfo[1]
        if (descInfo) {
          descInfo = descInfo.split(/\n/)
          descInfo = descInfo[0]
          // 移除空格
          descInfo = descInfo.replace(/\ +/g, "")
        } else {
          descInfo = fileType
        }
        fillIcon = '·'
      } else {
        // 文件夹的处理
        descInfo = typeIcon['file'] || ''
      }
    } catch (error) { }
    let menuInfo = `${dirDeepShow}${file}`
    // 处理说明位填充空格对齐 这个80 是顶宽距离 
    descInfo = `${getFileIcon(file)}${descInfo || ''}`
    let srcLength = menuInfo.length || 0
    let filliconlength = fileLength - srcLength
    filliconlength = filliconlength > 0 ? filliconlength : 5
    let fillSpace = new Array(filliconlength).fill(descInfo ? fillIcon : '')
    fillSpace = fillSpace.reduce((total, current) => {
      return '' + total + current
    })

    let desc = `${fillSpace}${descInfo}`
    // 填充数据
    output += `${menuInfo}${desc}\n`;
    // 如果是文件的处理
    if (isFile(tempdir)) {
      _objRes.childFiles.push({
        short: file, // 文件名
        full: tempdir // 完整路径
      });
    } else {
      let childParents = [].concat(...parents)
      // 处理父组件 是不是 最后一个
      childParents.unshift(isEnd ? ' ' : '|')
      // 不是文件就是文件夹
      _objRes.children[file] = await listFilemap({ dir: tempdir, parents: childParents });
    }
  });

  if (parents.length < 1) {
    _objRes.output = output;
  }
  return _objRes;
}

// 
/**
 * @description: 判断制定路径是否是文件
 * @param {type} fileName 文件名
 * @return {boolean} true-是文件 / false-不是文件
 */
function isFile(fileName) {
  return fs.statSync(fileName).isFile();
}

function getFileIcon(fileName) {
  const types = fileName.split('.')
  let icon = typeIcon[types[1]] || typeIcon[types[2]]
  if (icon === undefined) {
    icon = ''
  }
  return icon
}

/**
 * @description: 判断是否在禁用列表
 * @param {type} fileName 文件名
 * @return {boolean}  true-在列表 / false-不在列表
 */
function isBan(fileName) {
  fileName = fileName.split('\\')
  fileName = fileName[fileName.length - 1]
  if (/^\./.test(fileName)) {
    return true
  } else if (banList.indexOf(fileName) > -1) {
    return true
  } else {
    return false
  }
}

// 更新文件树文件
async function savefilemap() {
  let dir = path.resolve(__dirname, '..', '')
  let treeData = await listFilemap({ dir }).then(res => res.output)
  let _output = `\`\`\`\n${treeData}\n\`\`\``
  let filePath = `${path.resolve(__dirname, '..', 'FILEMAP.md')}`
  fs.writeFileSync(filePath, _output)
  console.log(filePath, '创建完成')
}

// 便利当前目录下 的js 合并
function mapDir(d) {
  const tree = {}
  const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())
  // 映射文件夹
  dirs.forEach(dir => {
    tree[dir] = mapDir(path.join(d, dir))
  })

  // 映射文件
  files.forEach(file => {
    if (path.extname(file) === '.js') {
      tree[path.basename(file, '.js')] = require(path.join(d, file))
    }
  })

  return tree
}
module.exports = {
  listFilemap,
  savefilemap,
  mapDir
}