const Handlebars = require('handlebars')
const fs = require('fs')
const { indexObj } = require('../preprocess')
const { logger } = require('handlebars')

// model helper
Handlebars.registerHelper('printModel', function(context, options) {
  debugger
  let result = `## Models\n`
  const keys = Object.keys(this)
  keys.forEach(key => {    
    const value = this[key]        
    result += `\n##### ${key}`
    if (typeof value === 'object') {      
      const desc = value.description
      result += desc ? ` - ${desc}\n\n` : '\n\n'
      const subKeys = Object.keys(value.properties)
      result += '| Params | Type | Description|\n'
      result += '| --- | --- | ---|\n'
      subKeys.forEach(subKey => {
        const subValue = value.properties[subKey]        
        let subValueType = null
        let subValueDesc = null
        if (subValue['$ref']) {
          const refKey = subValue['$ref'].replace('#/definitions/', '')
          const refItem = this[refKey]                    
          subValueType = refKey
          subValueDesc = refItem.description
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
  return result
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
        result += '\n| Params | Type | Required | Description|\n'
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
  return result
})

const generate = (templateStr, input) => {  
  // const obj = JSON.parse(file)
  // const id = obj['$id']
  // if (!indexObj[id]) {
  //   indexObj[id] = obj
  // }    
  const template = Handlebars.compile(templateStr)      
  console.log(input);  
  let result = template(input)
  result = result.replace(/&amp;/g,"&");
  result = result.replace(/&lt;/g,"<");
  result = result.replace(/&gt;/g,">");
  result = result.replace(/&nbsp;/g," ");
  result = result.replace(/&quot/g,"'");
  result = result.replace(/&#x60;/g,"`");
  return result
}

const write = (mergedObj, fileName, fileType) => {  
  try {
    if (fileType === 'json') {
      // console.log(mergedObj);
      const data = fs.writeFileSync(fileName, JSON.stringify(mergedObj), 'utf-8')
    } else if (fileType === 'md') {
      const modelTemplateStr = `{{#with definitions}}{{printModel}}{{/with}}`
      const modelResult = generate(modelTemplateStr, mergedObj)
      const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
      const apiResult = generate(apiTemplateStr, mergedObj)
      const modelData = fs.writeFileSync(fileName, modelResult, 'utf-8')
      const apiData = fs.appendFileSync(fileName, apiResult, 'utf-8')            
    }    
  } catch (error) {
    console.error(error)
  }
}

Handlebars.registerHelper("with", function(context, options) {
  debugger
  return options.fn(context);
});

const writeSeparated = (indexObj, mergedObj, fileType) => {
  const keys = Object.keys(indexObj)
  keys.forEach(key => {
    const item = indexObj[key]
    const id = item['$id'].replace('.schema.json', '')
    const { description, definitions, paths } = item
    try {
      if (fileType === 'json') {      
        // const data = fs.writeFileSync(fileName, JSON.stringify(mergedObj), 'utf-8')
        // TODO:
      } else if (fileType === 'md') {        
        // TODO: 获取当前文件路径
        // const mergedObjValue = JSON.stringify(mergedObj)
        const fileName = `/Users/sunpeng/documents/seeking_odds/Doc-Protocol/v2/generated/${id}.md`
        const modelTemplateStr = `{{#with definitions}}{{printModel index=mergedObj}}{{/with}}`
        const modelResult = generate(modelTemplateStr, item)
        const apiTemplateStr = `{{#with paths}}{{printAPI}}{{/with}}`
        const apiResult = generate(apiTemplateStr, item)
        const modelData = fs.writeFileSync(fileName, modelResult, 'utf-8')
        const apiData = fs.appendFileSync(fileName, apiResult, 'utf-8')            
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