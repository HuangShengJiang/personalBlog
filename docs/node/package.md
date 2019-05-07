---
title: package.json 
date: 2019-02-13
categories: 
 - Node
tags: 
 - node
---
## package.json
每个项目的根目录下面，一般都有一个package.json文件，作用是定义这个项目所需要的各种模块，以及项目的配置信息（比如名称、版本、许可证等元数据）。
`npm install`命令根据这个配置文件，自动下载所需的模块，也就是配置项目所需的运行和开发环境。

## 一个常见的package.json
```json
{
	"name": "Hello World",
	"version": "0.0.1",
	"author": "张三",
	"description": "第一个node.js程序",
	"keywords":["node.js","javascript"],
	"repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
	"license":"MIT",
	"engines": {"node": "0.10.x"},
	"bugs":{"url":"http://path/to/bug","email":"bug@example.com"},
	"contributors":[{"name":"李四","email":"lisi@example.com"}],
	"scripts": {
		"start": "node index.js"
	},
	"dependencies": {
		"express": "latest",
		"MD5": "~1.2.0"
	},
	"devDependencies": {
		"bower": "~1.2.8",
		"grunt": "~0.4.1"
	}
}
```

## 理解一波
### name、version
这是整个JSON对象中必填的两个属性，`name`指定项目名称，`version`指定版本号（注意：版本号遵守“大版本.次要版本.小版本”的格式 如：0.0.1）

### scripts
`scripts`指定了运行脚本命令的npm命令行缩写，比如start指定了运行npm run start时，所要执行的命令。

### dependencies、devDependencies、peerDependencies
```json
{
  "devDependencies": {
    "browserify": "~13.0.0",
    "karma-browserify": "^5.0.1",
    "grunt": "0.4.1",
    "express": "latest"
  }
}
```

`dependencies`、`devDependencies`和`peerDependencies`都是说明项目依赖的字段，但是其作用各不相同
1. `dependencies`指定项目运行所依赖的模块

2. `devDependencies`指定项目开发所需要的模块

3. `peerDependencies`是用来供插件指定其所需要的主工具的版本
有时，你的项目和所依赖的模块，都会同时依赖另一个模块，但是所依赖的版本不一样。比如，你的项目依赖A模块和B模块的1.0版，而A模块本身又依赖B模块的2.0版。
那么在同时安装模块A、B的时候，`peerDependencies`字段会提醒npm安装A模块的1.0版和B模块的2.0版，保证项目运行正常

::: tip 指定依赖的版本时还有一些小区别
* latest：安装最新版本。
* 指定版本：比如1.2.2，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。
* 波浪号+版本：比如~1.2.2，表示安装1.2.x的最新版本（不低于1.2.2），但是不安装1.3.x，也就是说安装时不改变大版本号和次要版本号。
* 插入号+版本：比如ˆ1.2.2，表示安装1.x.x的最新版本（不低于1.2.2），但是不安装2.x.x，也就是说安装时不改变大版本号。
:::

其实还有不是太常见的`bundledDependencies`和`optionalDependencies`，
`bundledDependencies`：在发布包时，包名的数组会被打包进去。
`optionalDependencies`：如果一个依赖项可用，但希望在这个依赖项无法被找到或者安装时失败npm还能继续处理(不中断)，那么你可以把它放在optionalDependencies中。
### bin
`bin`用来指定各个内部命令对应的可执行文件的位置
```json
{
  "bin": {
   "someTool": "./bin/someTool.js"
  } 
}
```
::: tip 
由于node_modules/.bin/目录会在运行时加入系统的PATH变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。
所有node_modules/.bin/目录下的命令，都可以用`npm run [命令]`的格式运行。
:::
### main
`main`用来指定加载的入口文件,加载模块使用的`require('module')`首先就会去加载这个指定的文件，如果没有指定，则默认为 index.js

### config
`config`字段用于添加命令行的环境变量
```json
{
  "config": {
   "port" : "8080"
  } 
}
```
程序运行后就可以在环境变量的对应字段获取到对应的值，字段名为 process.env.npm_package_config_XXX
```
http
  .createServer(...)
  .listen(process.env.npm_package_config_port)
```

### 其他
1. `author`用来指定模块/插件的作者

2. `description`用来指定模块/插件的说明

3. `keywords`用来指定模块/插件的关键词，有助于在人们使用 `npm search` 搜索时发现你的项目

4. `repository`用来指定模块/插件的使用的托管仓库及其地址

5. `license`用来指定模块/插件的开源协议，默认是 MIT

6. `engines`指明了该模块运行的平台，比如 Node 的某个版本或者浏览器

7. `contributors`指明了该模块/插件的贡献者们

8. `bugs` 当前项目的一些错误信息，如果有的话

9. `browser` 指定该模板供浏览器使用的版本

10. `homepage` 指定该模板的项目主页的url

11. `files` 指定一个被项目包含的文件名数组，如果你在里面放一个文件夹名，那么这个文件夹中的所有文件都会被包含进项目中
```json
{
  "files": [
    "src",
    "dist/*.js",
    "types/*.d.ts"
  ]
}
```

## 参考链接
[package.json文件](http://javascript.ruanyifeng.com/nodejs/packagejson.html)
[npm-package.json](https://docs.npmjs.com/files/package.json)