module.exports = {
    title: '1234567',
    description: 'Blog',
    head: [    // 注入到当前页面的 HTML <head> 中的标签
        // ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false, // 代码块显示行号
    },
    themeConfig: {
        nav:[ // 导航栏配置
            { text: "Home", link: "/" },
            { text: 'Categories',
                items: [
                    { text: 'JS', link: '/frontEndBasic/strictMode' },
                    { text: 'Node', link: '/node/package' },
                    { text: 'Library', link: '/interestingLibrary/v2ray' },
                ]
            },
            {text: 'About', link: '/about/' },
            {text: 'GitHub', link: 'https://github.com/flynull' }
        ],
        sidebar:  {
            '/frontEndBasic/': [
                'strictMode',
                'numberHandler',
                'YDKJS',
                // 'typeScript',
            ],
            '/interestingLibrary/': [
                'v2ray',
                'webpack',
                // 'lodash'
            ],
            '/node/':[
                'package'
            ]
        },
        search: false,
        searchMaxSuggestions: 10
    },
    plugins:{
        '@vuepress/back-to-top':{},
        '@vuepress/active-header-links':{},
        '@vuepress/google-analytics':{
            'ga': 'UA-139599860-1'
        }
    }
    // plugins: [
    //     '@vuepress/back-to-top',
    //     '@vuepress/active-header-links'
    // ]
}