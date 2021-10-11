const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const formatSchemaId = (schemaId) => {
  let schemaStr = schemaId 
  // 处理https://*/*.schema.json格式的$id
  if (schemaId && schemaId.indexOf('/') !== -1) {
    const splitItems = schemaId.split('/')      
    schemaStr = splitItems[splitItems.length -1]
  } 
  const id = schemaStr.replace('.schema.json', '')   
  return id
}

// 读取模板文件
const readTemplateFile = (subPath, fileName) => {
  const src = path.join(process.cwd(), 'src')
  const templates = path.join(src, 'templates')
  const filePath = path.join(templates, subPath)
  return fs.readFileSync(path.join(filePath, fileName), 'utf-8')
}

// helpers
Handlebars.registerHelper('upperCase', function(aString) {
  return aString.toUpperCase()
})

// data type adapter
Handlebars.registerHelper('typeTransformer', function(params) {
  // TypeScript Data Type
  /**
   * string
   * number
   * boolean
   * array
   * function
   * null
   * undefined
   * symbol
   * bigint ? // TODO:
   */

  /** Java Data Type
   * 
   */

  /** PHP Data Type
   * 
   */
})

// TODO: 
const tsTypeMap = {
  string: 'string',
  integer: 'number',
  number: 'number',
  boolean: 'boolean',
}

// 解析对象的属性
Handlebars.registerHelper('parseProperty', function(item) {
  const { type, enum: enumValue, items } = item || {}
  let value = tsTypeMap[type] || 'any'
  if (type === 'array' && items) {
    if (items.type) {
      value = `${items.type}[]`
    } else if (items['$ref']) {
      const refKey = items['$ref'].replace('#/definitions/', '')
      value = `${refKey}[]`
    }
  } 
  // 枚举值
  // else if (enumValue) {
  //   const values =  enumValue.map(item => {
  //     return typeof item === 'string' ? `'${item}'` : item
  //   }).join(',')
  //   value = `${tsTypeMap[type]} (enum values: ${values})`
  // } 
  else if (item['$ref']) {
    const refKey = item['$ref'].replace('#/definitions/', '')
    value = `${refKey}`
  }
  return new Handlebars.SafeString(value)
})

// 是否是GET请求
Handlebars.registerHelper('isGet', function(method) {
  const value = method && method.toUpperCase()
  return value === 'GET'
})

// 格式化请求参数Interface名称
Handlebars.registerHelper('formatParams', function(operationId) {
  if (!operationId) {
    return 'Params'
  }
  // 首字母大写
  const formatName = operationId.slice(0, 1).toLocaleUpperCase() + operationId.slice(1)  
  return `${formatName}Params`
})

// 请求参数Interface名称
Handlebars.registerPartial({
  'paramsInterface': '{{formatParams this.operationId}}'
})

const generate = (templateStr, input) => {
  const template = Handlebars.compile(templateStr)
  return template(input)
}

const write = (mergedObj, outputFolderPath, templateType) => {
  console.log('输出的文件')
  try {
    if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {
      writeMarkdown(outputFolderPath, 'index.md', mergedObj)
    } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
      writeTSModel(outputFolderPath, `index.d.ts`, mergedObj)
      writeTSApi(outputFolderPath, `index.ts`, mergedObj)
    }
  } catch (error) {
    console.error(error)
  }
}

// 生成markdown文件
const writeMarkdown = (filePath, name, data) => {
  const template = readTemplateFile('doc', 'md.hbs')
  writeGeneratedFile(filePath, name, template, data)
}

// 生成ts model(d.ts)文件
const writeTSModel = (filePath, name, data) => {
  const template = readTemplateFile('ts', 'model.hbs')
  writeGeneratedFile(filePath, name, template, data)
}

// 生成ts api(services)文件
const writeTSApi = (filePath, name, data) => {
  const template = readTemplateFile('ts', 'api.hbs')
  writeGeneratedFile(filePath, name, template, data)
}

const writeGeneratedFile = (filePath, name, template, data) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true })
    } 
  } catch (error) {
    console.error(error)
  }
  const fileName = path.join(filePath, name)
  // console.log('data is ', data);
  const result = generate(template, data)
  fs.writeFileSync(fileName, result, 'utf-8')
  console.log(chalk.green(`${fileName}`))
}

const writeSeparated = (indexObj, outputFolderPath, templateType) => {
  const keys = Object.keys(indexObj)
  keys.forEach(key => {
    const item = indexObj[key] 
    // TODO: item中添加索引对象indexObj，为了临时解决传参问题
    item.indexObj = indexObj
    const id = formatSchemaId(item['$id'])
    try {
      if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {
        const filePath = `${path.resolve(outputFolderPath)}/doc`
        writeMarkdown(filePath, `${id}.md`, item)
      } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
        const filePath = `${path.resolve(outputFolderPath)}/generated`
        writeTSModel(filePath, `${id}.d.ts`, item)
        writeTSApi(filePath, `${id}.ts`, item)
      }
    } catch (error) {
      console.error(error)
    }
  })  
}

module.exports = {
  generate,
  write,
  writeSeparated  
}