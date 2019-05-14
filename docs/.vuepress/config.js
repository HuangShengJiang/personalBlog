const moment = require('moment');

module.exports = {
    title: '1234567',
    description: 'Blog',
    theme: 'reco',
    head: [    // 注入到当前页面的 HTML <head> 中的标签
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
        // ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false, // 代码块显示行号
    },
    themeConfig: {
        author: 'Ray',
        nav:[ // 导航栏配置
            { text: "Home", link: "/", icon: 'reco-home' },
            // { text: 'Categories',
            //     items: [
            //         { text: 'JS', link: '/frontEndBasic/strictMode' },
            //         { text: 'Node', link: '/node/package' },
            //         { text: 'Library', link: '/interestingLibrary/v2ray' },
            //     ]
            // },
            // {text: 'About', link: '/about/real', icon: 'reco-account'},
            {text: 'About', link: '/about/', icon: 'reco-account'},
            { text: 'TimeLine', link: '/timeLine/', icon: 'reco-date' },
            {text: 'GitHub', link: 'https://github.com/flynull', icon: 'reco-github'}
        ],
        sidebar:  {
            '/frontEndBasic/': [
                'strictMode',
                'numberHandler',
                'YDKJS',
                'YDKJS_2',
                // 'typeScript',
            ],
            '/interestingLibrary/': [
                'v2ray',
                'webpack',
                'lodash'
            ],
            '/node/':[
                'package'
            ]
        },
        // search: false,
        // searchMaxSuggestions: 10,
        // 博客设置
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: 'Category' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: 'Tag'      // 默认文案 “标签”
            }
        },
        // valine 开启评论系统
        valineConfig: {
            appId: 'CoJfE1z5jd6V9ix7IVfYatEj-gzGzoHsz',// your appId
            appKey: '8wPEtmL0Q55WRm2bcboqt0n7', // your appKey
        }
    },
    plugins:{
        //返回顶部插件
        // '@vuepress/back-to-top':{},
        //滚动标题插件
        '@vuepress/active-header-links':{},
        //谷歌分析插件
        '@vuepress/google-analytics':{
            'ga': 'UA-139599860-1'
        },
        //最近更新显示插件
        '@vuepress/last-updated':{

            transformer: (timestamp, lang) => {
                    const moment = require('moment');
                    //暂时默认使用中文
                    moment.locale('zh-cn');
                    return moment(timestamp).fromNow()
                }
        },
        //图片点击浏览插件
        '@vuepress/medium-zoom':{},
        //进度条插件
        '@vuepress/nprogress':{}
    }
}