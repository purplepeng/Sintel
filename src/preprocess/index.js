const fs = require('fs')
const path = require('path')
/**
 * 索引对象；存放索引文件名，及文件json数据
 * 格式为：
 * {
 *    "board.schema.json": {
 *       // board.schema.json文件对应的JSON对象
 *    },
*     "fund.schema.json": {
 *       // fund.schema.json文件对应的JSON对象
 *    }
 *    ...
 * }
 */
const indexObj = {}
/**
 * 多个文件合并后的对象
 * 格式为：
 * {
 *     "definitions": {
          // 所有json文件中定义的definitions的并集  
 *     },
 *     "paths": {
 *        // 所有json文件中定义的paths的并集
 *     }
 * }
 */
const mergedObj = {}
const read = (file) => {    
  const obj = JSON.parse(file)
  const id = obj['$id']
  if (!indexObj[id]) {
    indexObj[id] = obj
    // debugger
  }    
  Object.keys(obj).forEach(key => {
    if (!mergedObj[key]) {
      mergedObj[key] = obj[key]
    } else {
      if (typeof obj[key] === 'object' && !(obj[key] instanceof Array)) {
        Object.keys(obj[key]).forEach(itemKey => {
          mergedObj[key][itemKey] = obj[key][itemKey] // TODO:  key去重 
        })
      } else {
        mergedObj[key] = mergedObj[key].concat(obj[key]) // TODO:  数组去重           
      }
    }    
  }) 
  // console.log(mergedObj);
  // console.log(JSON.stringify(mergedObj));
}

const preprocess = (folderPath) => {
  fs.readdirSync(folderPath).forEach(fileName => {    
    const fileDir = path.join(folderPath, fileName)
    // 只解析json文件    
    if (path.extname(fileDir) === '.json') {
      console.log(fileDir);
      try {
        const data = fs.readFileSync(fileDir, 'utf8')
        if (data) {
          read(data)    
        } 
      } catch (err) {
        console.error(err)
      }  
    }     
    // fs.stat(fileDir, (err, stats) => {
    //   console.log('stats', stats)
    // })
  })
}

module.exports = {
  indexObj,
  mergedObj,
  preprocess
}