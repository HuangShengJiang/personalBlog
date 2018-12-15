module.exports = {
    title: 'Blog',
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
            {text: 'JS', link: '/frontEndBasic/' },
            {text: 'Node', link: '/node/' },
            {text: 'About', link: '/about/' },
            {text: 'GitHub', link: 'https://github.com/HuangShengJiang' }
        ],
        sidebar:  {

        },
        search: false,
        searchMaxSuggestions: 10
    }
}