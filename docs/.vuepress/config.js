module.exports = {
    title: '生姜的博客',
    description: '个人博客',
    head: [    // 注入到当前页面的 HTML <head> 中的标签
        // ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        nav:[ // 导航栏配置
            {text: '前端', link: '/frontEndBasic/' },
            {text: 'Node', link: '/node/' },
            {text: 'GitHub', link: 'https://github.com/HuangShengJiang' },
        ],
        search: false,
        searchMaxSuggestions: 10
    }
}