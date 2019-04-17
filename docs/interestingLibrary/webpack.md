---
title: Webpack
---
> 本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
## 写在前面
那些安装、起步、基本概念在这里就不会再做赘述，官方的文档写的很清楚了。在这里只介绍Webpack4中一些比较常用的配置和功能。

因为使用webpack打包的代码需要在多个环境部署，而不同的环境对构建出来的代码要求又不尽相同。比如生产环境要求构建出来的代码体积尽可能小，而开发环境则对错误的定位要求更高和允许代码的热重载，这就导致了不同环境需要不同打包配置，所以建议将不同的环境所需的配置代码分开，只将公共的配置放在一块的做法是值得提倡的；

直接上代码吧。

webpack.common.js:
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    //打包程序的入口，可以设置多个
    entry:{
        app:'./src/index.js',
        //指定的第三方库(library)，将其导到一个ckunk中
        vendor: [
            'lodash'
        ]
    },
    module: {
        rules: [
            //使用style-loader和css-loader加载css 
            {
                test: /\.css$/,
                use: [
                'style-loader',
                'css-loader'
                ]
            },
            //使用file-loader加载图片 
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                'file-loader'
                ]
            },
            //使用file-loader加载字体文件
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            //使用csv-loader加载数据文件
            {
                test: /\.(csv|tsv)$/,
                use: [
                'csv-loader'
                ]
            },
            //使用xml-loader加载xml文件
            {
                test: /\.xml$/,
                use: [
                'xml-loader'
                ]
            }
        ]
    },
    //打包程序的出口
    output: {
        //通过使用 output.filename 进行文件名替换，可以确保浏览器获取到修改后的文件。
        filename: '[name].[chunkhash].js',
        //启用动态代码拆分时,这里使用了 chunkFilename，它决定非入口 chunk 的名称。
        // chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins:[
        //使用CleanWebpackPlugin插件 在每次构建代码前清理输出的文件夹
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns:['dist']
        }),
        //使用CleanWebpackPlugin插件 生成 html模板 并注入构建好的代码
        new HtmlWebpackPlugin({
            title: 'Caching'
        }),
        //使用 ProvidePlugin 后，能够在通过 webpack 编译的每个模块中，通过访问一个变量来获取到 package 包
        //以下配置告诉webpack：如果你遇到了至少一处用到 lodash 变量的模块实例，那请你将 lodash package 包引入进来，并将其提供给需要用到它的模块。
        //看情况决定用不用
        // new webpack.ProvidePlugin({
            // _: 'lodash'
            // 这样就能很好的与 tree shaking 配合，将 lodash 库中的其他没用到的部分去除。
            // join: ['lodash', 'join']
        // }),
        //这主要用于长效缓存中，当引用发生变化时，不影响vendor的缓存
        new webpack.HashedModuleIdsPlugin(),
        // 以下这是 webpack3 的做法，主要用于长效缓存
        // CommonsChunkPlugin插件  将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
        // new webpack.optimize.CommonsChunkPlugin({  
        //     name: 'vendor'   
        // }),

        // CommonsChunkPlugin插件 在每次修改后的构建结果中，将 webpack 的样板(boilerplate)和 manifest 提取出来。防止chunkhash变动，达到缓存目的
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'manifest'
        // }),

        // CommonsChunkPlugin插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共 bundle 的名称。
        // })
    ],
    //webpack4已经移除了原来的 webpack.optimize.CommonsChunkPlugin，
    // 转而使用optimization.splitChunks.cacheGroups来配置，用的插件是SplitChunksPlugin
    optimization: { 
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                commons: {
                    name:'common',// 指定公共 bundle 的名称。
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
        
    }
}
```

webpack.dev.js:
```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common,{
    output: {
        filename: '[name].[hash].js',
        //publicPath 也会在服务器脚本用到，以确保文件资源能够被正确访问到
        // publicPath: '/'
    },
    //开启后可以准确地知道错误来自于哪个源文件。
    devtool: 'inline-source-map',
    devServer:{
        contentBase:'./dist',
        // 启用devserver的热重载
        hot: true
    },
    plugins:[
        // 添加了 内置的NamedModulesPlugin插件，以便更容易查看要修补(patch)的依赖
        new webpack.NamedModulesPlugin(),
        
        // 添加了 内置的HotModuleReplacementPlugin插件，添加热重载的功能
        new webpack.HotModuleReplacementPlugin()
    ],
    mode:'development'
})
```

webpack.prod.js:
```javascript
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    //避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能 
    // devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    mode:'production'
})
```

## 另外提一下

1. 当你想看打包详细信息，往往会看到有些模块被隐藏看不了，这时可以使用 ` --display-modules` 命令将隐藏的模块显示出来
```shell
Hash: faddbae5c142a11af0b8
Version: webpack 4.29.6
Time: 1439ms
Built at: 2019-04-17 17:37:16
                         Asset       Size  Chunks             Chunk Names
   app.d015c1457e0be4f2fbdc.js   1.83 KiB       1  [emitted]  app
common.c6107739f15f4b598fc9.js   69.4 KiB       0  [emitted]  common
                    index.html  350 bytes          [emitted]
vendor.484c23dbe5a52ef3941c.js   1.46 KiB       2  [emitted]  vendor
Entrypoint app = common.c6107739f15f4b598fc9.js app.d015c1457e0be4f2fbdc.js
Entrypoint vendor = common.c6107739f15f4b598fc9.js vendor.484c23dbe5a52ef3941c.js
[0] multi lodash 28 bytes {2} [built]
[YuTi] (webpack)/buildin/module.js 497 bytes {0} [built]
[tjUo] ./src/index.js + 1 modules 1.66 KiB {1} [built]
    | ./src/index.js 1.59 KiB [built]
    | ./src/print.js 69 bytes [built]
[yLpj] (webpack)/buildin/global.js 472 bytes {0} [built]
    + 1 hidden module
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [YuTi] (webpack)/buildin/module.js 497 bytes {0} [built]
    [yLpj] (webpack)/buildin/global.js 472 bytes {0} [built]
        + 2 hidden modules
```

2. 建议大家使用项目内的 webpack和webpack-cli,因为你本机的webpack版本可能与别的项目的webpack版本不一致，可能会导致一些构建上的问题。 
    当然如果是使用 `npm script` 调用webpack命令，则默认使用的项目内安装的webpack。下面是测试（我项目内的webpack装的webpack4，全局安装的是webpack3），直接使用webpack命令和使用`npm script`调用webpack命令使用webpack是有所不同的：

```
$ npm run say

> dev_env@1.0.0 say C:\Users\……\……\webpack\dev_env
> webpack -v

4.29.6


$ webpack -v
3.10.0
```    

## 参考链接
1. [webpack中文-指南](https://www.webpackjs.com/guides/)