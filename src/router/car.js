export default [{
    name: "index",
    path: "/",
    component:resolve => require(['Pages/index'], resolve),
    children: [{
        name: "dashboard",
        path: "dashboard",
        component: resolve => require(['Pages/dashboard/index'], resolve)
    }]
}]
