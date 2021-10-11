# Sintel
A tool use JSON schema to generate api doc, api template with TypeScript.

### Install
`npm install`

`npm link`

### Usage

```
Usage: sintel [options]

Options:
  -t --template-type <type>  模板类型（markdown、TypeScript等） (default: "markdown")
  -i --input-type <type>     输入目录（json文件所属目录） (default: "./")
  -o --output-type <type>    输出目录（生成文件的目标目录） (default: "./")
```

example:
`sintel -t ts  -i ./demo -o ./output`