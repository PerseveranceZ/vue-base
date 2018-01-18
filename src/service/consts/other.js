export default [{
    name: 'MENU',
    value: [{
        id: 1,
        parentId: 0,
        label: 'page1',
        route: '/page1',
        show: true,
        order: 1,
        icon: 'arrow-graph-up-right',
    }, {
        id: 2,
        parentId: 1,
        order: 1,
        label: 'page1.1',
        route: '/page1/page1.1',
        show: true,
        icon: 'ios-flower'
    }, {
        id: 3,
        parentId: 0,
        order: 1,
        label: 'page2',
        route: '/page2',
        show: true,
        icon: 'ios-briefcase'
    }]
}]