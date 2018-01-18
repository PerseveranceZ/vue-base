export default [{
    name: "404",
    path: "/*",
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => require(['Pages/error-page/404'], resolve)
}, {
    name: "403",
    path: "/403",
    meta: {
        title: '403-权限不足'
    },
    component: resolve => require(['Pages/error-page/403'], resolve)
}, {
    name: "500",
    path: "/500",
    meta: {
        title: '500-服务端错误'
    },
    component: resolve => require(['Pages/error-page/500'], resolve)
}]