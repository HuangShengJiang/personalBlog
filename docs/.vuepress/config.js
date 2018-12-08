module.exports = {
    title: '生姜的博客',
    description: '我的博客',
    head: [    // 注入到当前页面的 HTML <head> 中的标签
        // ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        nav:[ // 导航栏配置
            {text: '前端基础', link: '/accumulate/' },
            {
                text: '语言',
                items: [
                    { text: 'Chinese', link: '/language/chinese' },
                    { text: 'Japanese', link: '/language/japanese' }
                ]
            }
        ]
    }
}