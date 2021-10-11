#!/usr/bin/env node

const { program } = require('commander')
const preprocessor = require('./src/preprocess/index')
const generator = require('./src/generate/index')

program
  .version('0.0.1')
  .option('-t --template-type <type>', '模板类型（markdown、TypeScript等）', 'markdown') // 默认模板类型为markdown
  .option('-i --input-type <type>', '输入目录（json文件所属目录）', './') // 默认输入目录为当前目录
  .option('-o --output-type <type>', '输出目录（生成文件的目标目录）', './') // 默认输出目录为当前目录

program.parse(process.argv)
if (program.inputType) {
  console.log(`- ${program.inputType}`)
}
if (program.outputType) {
  console.log(`- ${program.outputType}`)
}

const templateType = program.templateType

// 输入路径
const inputFolderPath = program.inputType
preprocessor.preprocess(inputFolderPath)

// 输出路径
const outputFolderPath = program.outputType
generator.write(preprocessor.mergedObj, outputFolderPath, templateType)
generator.writeSeparated(preprocessor.indexObj, outputFolderPath, templateType)
