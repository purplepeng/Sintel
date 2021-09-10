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

// model helper
Handlebars.registerHelper('printModel', function() {  
  let result = `## Models\n`
  const keys = Object.keys(this)  
  keys.forEach(key => {    
    const value = this[key]        
    result += `\n##### ${key}`
    if (typeof value === 'object') {      
      const desc = value.description
      result += desc ? ` - ${desc}\n\n` : '\n\n'
      const subKeys = Object.keys(value.properties)
      result += '| Params | Type | Description |\n'
      result += '| --- | --- | ---|\n'
      subKeys.forEach(subKey => {
        const subValue = value.properties[subKey]        
        let subValueType = null
        let subValueDesc = null
        if (subValue['$ref']) {
          const refKey = subValue['$ref'].replace('#/definitions/', '')
          const refItem = this[refKey]                    
          subValueType = refKey
          // TODO:  引用的该文件外的model对象，目前没有显示出描述
          subValueDesc = refItem ? refItem.description : '-'
        } else {          
          if (subValue.type === 'array' && subValue.items) {
            const subValueItem = subValue.items            
            let subValueRefKey = null
            if (subValueItem['$ref']) {
              subValueRefKey = subValueItem['$ref'].replace('#/definitions/', '')
            } else {
              subValueRefKey = subValueItem.type 
            }            
            subValueType = `${subValueRefKey}[]`
          } else {
            subValueType = subValue.type || ''
          }
          subValueDesc = subValue.description || '-'
        }
        result += '|`' + subKey + '`|`' + subValueType + '`|' + subValueDesc + '| \n'        
      })
    }
  })
  return new Handlebars.SafeString(result)
})

// api helper
Handlebars.registerHelper('printAPI', function() {
  let result = '## API\n'
  const keys = Object.keys(this)
  debugger
  keys.forEach(key => {
    const value = this[key]
    const subKeys = Object.keys(value)
    debugger
    subKeys.forEach(subKey => {
      const subValue = value[subKey]      
      result += '\n`' + subKey.toLocaleUpperCase() + '``' + key + '`' + subValue.description + '\n\n'
      result += '请求参数：\n'      
      const reqParams = subValue.parameters      
      if (reqParams && reqParams.length) {
        result += '\n| Params | Type | Required | Description |\n'
        result += '| --- | --- | --- | --- |\n'
        reqParams.forEach(param => {          
          const { name, type, required, description } = param
          result += '|`' + name + '`|`' + type + '`|' + (required || '-') + '|' + (description || '-') + '| \n'        
        }) 
      } else {
        result += '无\n'
      }     
      result += '\n返回参数：\n\n'
      result += '| Params | Type |\n'
      result += '| --- | ---|\n'
      const resp = subValue.responses
      console.log('resp is ', resp);
      debugger
      
      if (resp['200']) {
        const respData = resp['200'].schema;
        
        if (respData['$ref']) {
          const refKey = respData['$ref'].replace('#/definitions/', '')
          // TODO:
          const subValueName = 'result'
          result += '|`' + subValueName + '`|`' + refKey + '`|\n'  
        } else {
          if (respData.type === 'array' && respData.items) {
            const subValueItem = respData.items            
              let subValueRefKey = null
              if (subValueItem['$ref']) {
                subValueRefKey = subValueItem['$ref'].replace('#/definitions/', '')
              } else {
                subValueRefKey = subValueItem.type 
              }            
              subValueType = `${subValueRefKey}[]`
              // TODO:
              const subValueName = 'result'
              result += '|`' + subValueName + '`|`' + subValueType + '`|\n'        
          } else {
            const respSubKeys = respData.properties ? Object.keys(respData.properties) : []          
            respSubKeys.forEach(respSubKey => {
              const subValue = respData.properties[respSubKey]            
              let subValueType = null            
              if (subValue['$ref']) {
                const refKey = subValue['$ref'].replace('#/definitions/', '')                            
                subValueType = refKey              
              } else {          
                if (subValue.type === 'array' && subValue.items) {
                  const subValueItem = subValue.items            
                  let subValueRefKey = null
                  if (subValueItem['$ref']) {
                    subValueRefKey = subValueItem['$ref'].replace('#/definitions/', '')
                  } else {
                    subValueRefKey = subValueItem.type 
                  }            
                  subValueType = `${subValueRefKey}[]`
                } else {
                  subValueType = subValue.type || ''
                }              
              }
              result += '|`' + respSubKey + '`|`' + subValueType + '`| \n'  
            })
          }
        }
      } else {
        // TODO:
      }
      
      result += '___\n'
    })
  })
  return new Handlebars.SafeString(result)
})

// TypeScript model helper
Handlebars.registerHelper('tsModel', function(context) {    
  let result = ''
  const keys = Object.keys(this)  
  // 构造import
  /**
   * 引用关系map
   * key: schemaId，引用ID
   * value: 被引用的模型对象
   * {
   *    'schemaId': ['product', 'order']   
   * ]
   */
  const refMap = {}
  keys.forEach(key => {    
    const value = this[key]           
    if (typeof value === 'object') {              
      const subKeys = Object.keys(value.properties)      
      const indexObj = context.data && context.data.root ? context.data.root.indexObj : null      
      // console.log(indexObj)      
      subKeys.forEach(subKey => {
        const subValue = value.properties[subKey]        
        let subValueType = null
        let subValueRef = null
        let targetRef = null
        if (subValue['$ref']) {
          targetRef = subValue['$ref']
        } else if (subValue.items && subValue.items['$ref']) {
          targetRef = subValue.items['$ref']
        }
        if (targetRef) {
          const refKey = targetRef.replace('#/definitions/', '')
          const refItem = this[refKey]                    
          subValueType = refKey          
          if (!refItem && indexObj) {
            const moduleKeys = Object.keys(indexObj)            
            for (let index = 0; index < moduleKeys.length; index++) {
              const element = moduleKeys[index];
              const definitions = indexObj[element].definitions              
              if (definitions && definitions[refKey]) {
                subValueRef = formatSchemaId(indexObj[element]['$id'])                              
                if (refMap[subValueRef]) {
                  if (refMap[subValueRef].indexOf(subValueType) === -1) {
                    refMap[subValueRef].push(subValueType) 
                  }                  
                } else {
                  refMap[subValueRef] = [subValueType]
                }                
                break;
              } 
            }            
          }
        }         
      })            
    }
  })

  Object.keys(refMap).forEach(item => {
    result += `import { ${refMap[item].join(', ')} } from './${item}.d'\n`
  })
  if (Object.keys(refMap).length) {
    result += '\n'
  }

  keys.forEach(key => {    
    const value = this[key]           
    if (typeof value === 'object') {      
      const desc = value.description
      result += desc ? `// ${desc}\n` : ''
      const subKeys = Object.keys(value.properties)
      result += `export interface ${key} {\n`            
      subKeys.forEach(subKey => {
        const subValue = value.properties[subKey]        
        let subValueType = null
        let subValueDesc = null
        if (subValue['$ref']) {
          const refKey = subValue['$ref'].replace('#/definitions/', '')
          const refItem = this[refKey]                    
          subValueType = refKey
          // TODO:  引用的该文件外的model对象，目前没有显示出描述
          subValueDesc = refItem && refItem.description ? `// ${refItem.description}` : ''
        } else {          
          if (subValue.type === 'array') {
            let subValueRefKey = null
            if (subValue.items) {
              const subValueItem = subValue.items                          
              if (subValueItem['$ref']) {
                subValueRefKey = subValueItem['$ref'].replace('#/definitions/', '')
              } else {
                subValueRefKey = subValueItem.type 
              }                          
            } else {
              subValueRefKey = 'any' 
            }            
            subValueType = `${subValueRefKey}[]` 
          } else {
            subValueType = subValue.type || ''
          }
          subValueDesc = subValue.description ? `// ${subValue.description}` : ''
        }
        result += `  ${subKey}: ${subValueType}; ${subValueDesc}\n`        
      })
      result += '}\n\n'
    }
  })
  return new Handlebars.SafeString(result)
})

const generate = (templateStr, input) => {
  const template = Handlebars.compile(templateStr)    
  return template(input)
}

const write = (mergedObj, folderPath, templateType) => {  
  console.log('输出的文件')
  try {        
    if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {      
      const modelTemplateStr = `{{#with definitions}}{{printModel}}{{/with}}`
      const modelResult = generate(modelTemplateStr, mergedObj)
      const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
      const apiResult = generate(apiTemplateStr, mergedObj)
      
      const fileName = path.join(folderPath, 'index.md')   
      fs.writeFileSync(fileName, modelResult, 'utf-8')
      fs.appendFileSync(fileName, apiResult, 'utf-8') 
      console.log(chalk.green(`${fileName}`))
    } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
       // TODO:       
       const modelTemplateStr = `{{#with definitions}}{{tsModel}}{{/with}}`
       const modelResult = generate(modelTemplateStr, mergedObj)
      //  const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
      //  const apiResult = generate(apiTemplateStr, mergedObj)
      
       const fileName = path.join(folderPath, 'index.d.ts')   
       fs.writeFileSync(fileName, modelResult, 'utf-8')
      //  fs.appendFileSync(fileName, apiResult, 'utf-8') 
      console.log(chalk.green(`${fileName}`))
    }       
  } catch (error) {
    console.error(error)
  }
}

// Handlebars.registerHelper("with", function(context, options) {
//   return options.fn(context);
// });

const writeSeparated = (indexObj, folderPath, templateType) => {
  const keys = Object.keys(indexObj)
  keys.forEach(key => {
    const item = indexObj[key] 
    // TODO: item中添加索引对象indexObj，为了临时解决传参问题
    item.indexObj = indexObj    
    debugger
    const id = formatSchemaId(item['$id'])
    // const { description, definitions, paths } = item
    try {              
      if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {
        const filePath = `${path.resolve(folderPath)}/doc`
        try {
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath)
          } 
        } catch (error) {
          console.error(error)
        }
        const fileName = path.join(filePath, `${id}.md`)           
        const modelTemplateStr = `{{#with definitions}}{{printModel}}{{/with}}`
        const modelResult = generate(modelTemplateStr, item)
        const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
        const apiResult = generate(apiTemplateStr, item)
        fs.writeFileSync(fileName, modelResult, 'utf-8')
        fs.appendFileSync(fileName, apiResult, 'utf-8')  
        console.log(chalk.green(`${fileName}`))
      } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
        const filePath = `${path.resolve(folderPath)}/generated`
        try {
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath)
          } 
        } catch (error) {
          console.error(error)
        }
        // TODO:
        const fileName = path.join(filePath, `${id}.d.ts`)
        const modelTemplateStr = `{{#with definitions}}{{tsModel}}{{/with}}`
        const modelResult = generate(modelTemplateStr, item)
        // const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
        // const apiResult = generate(apiTemplateStr, item)
        fs.writeFileSync(fileName, modelResult, 'utf-8')
        // fs.appendFileSync(fileName, apiResult, 'utf-8') 
        console.log(chalk.green(`${fileName}`))
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