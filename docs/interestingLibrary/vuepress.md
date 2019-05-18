---
title: VuePress
date: 2019-05-18
categories: 
 - Library
tags: 
 - 建站
 - tool
---
> VuePress 由两部分组成：一个以 Vue 驱动的主题系统的简约静态网站生成工具，和一个为编写技术文档而优化的默认主题。它是为了支持 Vue 子项目的文档需求而创建的。

## 写在前面
之前用过WordPress和Hexo建过个人博客，个人还是觉得还是VuePress最容易上手，直接上来就可以写，需要配置的地方很少，所以写一篇文章来记录一下。

## 简单使用
``` 
# 安装
yarn global add vuepress # 或者：npm install -g vuepress

# 新增一个文件夹用于操作
mkdir demo  # 或者也可以在你原有项目文件夹里直接进行操作。
cd demo

# 将 VuePress 作为一个本地依赖安装
yarn add -D vuepress # 或者：npm install -D vuepress

# 在当前文件夹中  新建一个 docs 文件夹 用于 存放文章
mkdir docs

# 在docs 文件夹中 新建一个 markdown 文件
echo '# Hello VuePress!' > docs/README.md

# 运行一下试试
vuepress dev docs
> VuePress dev server listening at http://localhost:8080/
```

点开网址会发现页面上出现了`Hello VuePress!`。
    ![第一次运行](/img/library/vuepress/helloWorld.png)


接下来在`package.json`中添加节点`scripts`：

```
{
  "devDependencies": {
    "vuepress": "^0.14.11"
  },
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs",
  }
}
```
然后我们就可以愉快的使用`npm run dev`和`npm run build`来运行和构建项目了。

接下来我们再给这个原始的博客做一些配置，下来要说到最重要的配置文件`config.js`了

在之前创建的`docs`文件中新增一个`.vuepress`文件夹，并在里面新建一个`config.js`文件

做完上面的操作后，咱们博客的目录会像下面一样：
``` 
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

可以把下面的配置复制去做修改`config.js`：
``` 
module.exports = {
    title: '网站标题',
    description: '网站说明',
    markdown: {
        lineNumbers: false, // 代码块显示行号
    },
    themeConfig: {
        author: 'Ray',
        nav:[
            // 导航栏配置（这里的地址都是基于‘docs’文件夹的，也就是说你的所有文章都必须放在docs文件夹下）
            { text: "Home", link: "/"},
            { text: 'Categories',
                 items: [
                     { text: '分类一', link: '/demo1/' }, //默认会链接到 该文件下的 index.md 或者README.md 文件
                     { text: '分类二', link: '/demo2/' },
                     { text: '分类三', link: '/demo3/' },
                 ]
            },
            {text: 'GitHub', link: 'https://github.com/'} //可以跳转到别的页面
        ],
        //定义页面的显示的侧边栏(!!!注意：这里)
        sidebar:  {
            '/demo1/': [
                'article1'
            ],
            '/demo2/': [
                'article2'
            ],
            '/demo3/':[
               'article3'
            ]
        },
        search: false,
        searchMaxSuggestions: 10,
    }
}
```
当你运行`npm run dev`时，会看到下面界面
     ![应用配置](/img/library/vuepress/show1.png)

但是点击所有页面都会出现404错误，那是因为你还没有对应位置的文章让应用链接到，
让我们来完善目录，在`docs`文件下分别创建`demo1`、`demo2`和`demo3`三个文件夹，并新建默认的页面 README.md

``` 
├─ docs
│  ├─ README.md
│  ├─demo1
│  │ └─ README.md
│  ├─demo2
│  │ └─ README.md
│  ├─demo3
│  │ └─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```

/demo1/README.md 可以随便写些内容进去。
``` 
我是 demo1 的默认首页
```

重新运行程序`npm run dev`,会看到已经可以从页面菜单进行跳转了。
    ![菜单跳转](/img/library/vuepress/show2.png)


## 参考链接
1. [VuePress官网](https://v1.vuepress.vuejs.org/zh/)