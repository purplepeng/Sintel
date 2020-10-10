const Handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')

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
  keys.forEach(key => {
    const value = this[key]
    const subKeys = Object.keys(value)
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
      const respData = resp['200'].schema
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
      result += '___\n'
    })
  })
  return new Handlebars.SafeString(result)
})

const generate = (templateStr, input) => {
  const template = Handlebars.compile(templateStr)      
  // console.log(input);  
  return template(input)
}

const write = (mergedObj, folderPath, templateType) => {  
  try {    
    if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {      
      const modelTemplateStr = `{{#with definitions}}{{printModel}}{{/with}}`
      const modelResult = generate(modelTemplateStr, mergedObj)
      const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
      const apiResult = generate(apiTemplateStr, mergedObj)
      
      const fileName = path.join(folderPath, 'index.md')   
      fs.writeFileSync(fileName, modelResult, 'utf-8')
      fs.appendFileSync(fileName, apiResult, 'utf-8') 
    } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
       // TODO:
    }       
  } catch (error) {
    console.error(error)
  }
}

// Handlebars.registerHelper("with", function(context, options) {
//   debugger
//   return options.fn(context);
// });

const writeSeparated = (indexObj, folderPath, templateType) => {
  const keys = Object.keys(indexObj)
  keys.forEach(key => {
    const item = indexObj[key]        
    const schemaId = item['$id']
    let schemaStr = schemaId    
    if (schemaId && schemaId.indexOf('/') !== -1) {
      const splitItems = schemaId.split('/')      
      schemaStr = splitItems[splitItems.length -1]
    } 
    id = schemaStr.replace('.schema.json', '')           
    // const { description, definitions, paths } = item
    try {
      // 
      const filePath = `${path.resolve(folderPath)}/generated`
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath)
        } 
      } catch (error) {
        console.error(error)
      }  
      if (['markdown', 'Markdown', 'md', 'MD'].indexOf(templateType) !== -1) {
        const fileName = path.join(filePath, `${id}.md`)           
        const modelTemplateStr = `{{#with definitions}}{{printModel}}{{/with}}`
        const modelResult = generate(modelTemplateStr, item)
        const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
        const apiResult = generate(apiTemplateStr, item)
        fs.writeFileSync(fileName, modelResult, 'utf-8')
        fs.appendFileSync(fileName, apiResult, 'utf-8')  
      } else  if (['TypeScript', 'typescript', 'ts', 'TS']) {
        // TODO:
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