# vue-base
基于 webpack + vue-cli + iview + Vue 构建的一套 Vue 的 单页面应用（SPA）开发方案。

当然你也可以把 iview 切换成各个你想要的 mobile 或 PC 组件库（mobile 需要自行配置下移动端 html 的 meta 头），来进行敏捷开发。
## 功能说明
* 只需熟悉写法，便可敏捷开发
* 测试接口和 mock 接口，一键切换
* 文件层级划分，尽可能减少开发提交碰撞
* Service 配置生成 ORM，有命名空间，在业务中快速调用
* Vuex 可以拆分至不同业务模块中，业务可自行选择是否使用 Vuex 来渐进增强开发
* 支持打包分析 npm run analyz
* 支持异步组件加载
* 支持缓存层分离
* webpack 图片处理等等

### 目录结构

    ·
    |-- build              （打包配置相关，无必要请勿动）
    |-- conifg             （打包配置相关，无必要请勿动）
    |-- dist               （发布）
    |-- mock               （mock接口相关）
    |-- node_modules       （node 依赖）
    |-- static             （静态资源文件，图片，css，不走编译）
    |-- src                （工程目录）
        |-- assets         （动态资源文件，图片，css，每次都会走编译）
        |-- common         （业务组件）
        |-- components     （全局公用组件）
        |-- config         （项目请求配置）
        |-- directives     （指令）
        |-- pages          （页面逻辑）
        |-- router         （路由配置）
        |-- service        （服务层）
        |-- store          （全局的 store 如登录信息）
        |-- utils          （工具层）
        |-- app.vue        （根vue节点）
        |-- main.js        （业务的根节点 js）
    
### 脚手架指令

`npm run dev/start` 开发模式
`npm run build`     线上打包
`npm run analyz`    包分析( `webpack-bundle-analyzer` )

### 逻辑修改

修改文件目录中的```src\js\config\index.js```
``` javascript
// 接口拦截到需要跳转登录页面的 code 根据业务自行修改
export const LOGIN_CODE = 1000
// 请求 abort 超时时间
export const AJAXTIMEOUT = 20000
// 请求是否会发送本地的请求 
// true Service 中的请求会请求 localPath ，也就是 mock 路径，mock 统一发送 get 请求，底层已经帮转好 不用关心， 该配 post 就配置 post
// false 会走配置的 path 路径，一般就是测试接口和线上接口
export const LOCAL_AJAX = false

export const DEBUG = {
    // 请求详情打印
    req: false,
    // 响应详情打印
    res: false,
    // 开启vue debug
    v_debug: true,
    // 开启vue devtools
    v_devtools: true
}
```

修改接口拦截器逻辑```src\js\config\ajax.js```
``` javascript
/**
 * 文档地址https://github.com/mzabriskie/axios
 * ajax为axios的实例
 */
import axios from 'axios'

import {
    TESTPATH,
    ABORT_TIME,
    DEBUG
} from 'Config/index';

let _ajaxInstance = {}

_ajaxInstance = axios.create({
    timeout: ABORT_TIME*1000 //超时时间 nms后自动abort
})

// request 拦截器
_ajaxInstance.interceptors.request.use(function(config) {
    DEBUG.req && console.info(config.url, ' request:', config)
    // 请求带上时间
    // 请求拦截器 这里请自行根据业务做相应改动
    if(config.params)config.params.v = +new Date()
    return config;
}, function(error) {
    DEBUG.req && console.error('request', JSON.stringify(error))
    GLOBAL.vbus.$emit('request_error', error)
    return Promise.reject(error);
});

// response 拦截器
_ajaxInstance.interceptors.response.use(function(response) {
    DEBUG.res && console.info(response.config.url, ' response:', response)
    // resCode全局处理 这里请自行根据业务做相应改动
    if (response.data.resCode === 0) return response.data.data;

    !!response.config.noShowDefaultError || GLOBAL.vbus.$emit('ajax_handle_error', response)
    return Promise.reject(response)

}, function(error) {
    DEBUG.res && console.error('response', JSON.stringify(error))
    GLOBAL.vbus.$emit('response_error', error)
    return Promise.reject(error);
});

export default _ajaxInstance

```

然后来到 App.vue 中做自己统一处理的页面逻辑。

```javascript
...
GLOBAL.vbus.$on('ajax_handle_error', (resData) => {
    if(!!resData.config.noShowDefaultError) return
    // 这里通过 config/index.js 配置的 LOGIN_CODE 来做登录逻辑
    if (resData.data.resCode === LOGIN_CODE) {
        // 我们建议登录页面做成一个组件的形式 在全局 Store 中来控制他
        this.$store.commit('SET_TO_LOGIN_PATH', this.$route.path)
        this.$store.commit('SET_TO_LOGIN', true)
        return
    }
     // 其他 code 不等于 0 的情况
    this.$Notice.warning({
        title: '操作失败',
        desc: resData.data.msg,
        onClose() { }
    });
})
GLOBAL.vbus.$on('request_error', (resData) => {
    // 网络请求错误，断网之类
    this.$Notice.error({
        title: '请求服务器失败',
        desc: '请检查您的网络连接情况',
        onClose() {
            //放入接口错误处理
        }
    });
})
GLOBAL.vbus.$on('response_error', (resData) => {
    // 这里基本上就是网络接受错误，一般是服务器错误，可以根据不同的 code 码在做逻辑
    this.$Notice.error({
        title: '服务器在开小差',
        desc: '请稍后重试',
        onClose() {
            //放入接口错误处理
        }
    });
})
...
```


### `ajax 和 常量使用规范 ( Service 层)`

底层使用`axios`，需要了解`API`自行了解`axios`库，需要在`service`中配置好自己的请求发送参数如
``` javascript
// order.js
{
    // 接口名称，调用时会用到，注意重复
    name: 'detail',
    // 发送请求类型
    method: 'GET',
    // 接口描述
    desc: '医生个人信息接口',
    // 本地地址
    localPath: '/test/sectionDoctor/detail',
    // 线上地址
    path: '/mobile/wx/individualDoc/queryById',
    // 发送出去的参数，自动会截取相应的参数，即使你传了很多用不到的参数也没关系。
    // 如果不传定义好的参数，则会把下面的默认值带上发出去
    params: {
        key: value
    }
}

```
`Service` 层大概结构如下：
```
|-service                  （服务层）
    |-apis                 （请求集合）
        |-index.js         （主页配置）
        |-order.js         （订单模块）
    |-consts               （常量集合）
        |-index.js         （主页配置）
        |-order.js         （订单模块）
```
`Service` 层文件命名尽量保持对应，抽象我们的业务，这样我们可以减少很多变量和请求方法的冗余代码，order 模块在 index 中进行配置如下：

```javascript
import { Apior } from 'Utils/apior'
// 报告查询
import order from './order'

export default new Apior({
    order
})['API']
```
这样 Apior 会自动用 order 来作为前缀，做一层命名空间，放到$service中。

业务中调用方式
``` javascript
this.$apis['order/detail']({
    key: value
}, {
    // 额外的参数 如：header
    noShowDefaultError: true // 不弹出默认的报错提示
}).then((data) => {
    // 已经过滤了 resData.data，可直接使用，无需判断
    // 具体的过滤器在 config/ajax 中
}, () => {
    // 失败的回调，错误已经自动报了，一般无需关心
});
```
如果你想单独发请求也没关系
``` javascript
//this.$ajax 替换为 GLOBAL.ajax 也行
this.$ajax.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 
// Optionally the request above could also be done as 
this.$ajax.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })

this.$ajax.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
对于常量，建议都使用大写。
```javascript
//service/consts/other 目录结构
export default [{
    name: 'MENU', 
    value: [{
        id: 1,
        parentId: 0,
        label: '指标管理',
        route: '/tomato/target',
        show: true,
        order: 1,
        icon: 'arrow-graph-up-right',
    }, {
        id: 2,
        parentId: 0,
        order: 1,
        label: 'IDEA管理',
        route: '/tomato/idea',
        show: true,
        icon: 'ios-flower'
    }, {
        id: 3,
        parentId: 0,
        order: 1,
        label: '项目管理',
        route: '/tomato/project',
        show: true,
        icon: 'ios-briefcase'
    }, {
        id: 4,
        parentId: 0,
        order: 1,
        label: '项目报告',
        route: '/tomato/report',
        show: true,
        icon: 'ios-paper'
    }]
}]
```
这样我们在业务中使用的时候 `this.$consts['other/MENU']` 便可以拿到，如果不在业务中：
```javascript
import CONSTS from 'Service/consts'

console.log(CONSTS['other/MENU'])

```
也是完全可以拿到的，`apis` 也是。



### `router` 路由

支持异步加载组件，但不建议所有组件都异步加载，请熟知异步加载组件的使用场景。（以下出自[vue2组件懒加载浅析](http://www.cnblogs.com/zhanyishu/p/6587571.html)）

　　1、路由页面以及路由页面中的组件全都使用懒加载

　　优点：（1）最大化的实现随用随载

　　　　　（2）团队开发不会因为沟通问题造成资源的重复浪费　　　　

　　缺点：（1）当一个页面中嵌套多个组件时将发送多次的http请求，可能会造成网页显示过慢且渲染参差不齐的问题

　　2、路由页面使用懒加载， 而路由页面中的组件按需进行懒加载, 即如果组件不大且使用不太频繁, 直接在路由页面中导入组件, 如果组件使用较为频繁使用懒加载

　　优点：（1）能够减少页面中的http请求，页面显示效果好

　　缺点：（2）需要团队事先交流， 在框架中分别建立懒加载组件与非懒加载组件文件夹

　　3、路由页面使用懒加载，在不特别影响首页显示延迟的情况下，根页面合理导入复用组件，再结合方案2

　　优点：（1）合理解决首页延迟显示问题

　　　　　（2）能够最大化的减少http请求， 且做其他他路由界面的显示效果最佳

　　缺点：（1）还是需要团队交流，建立合理区分各种加载方式的组件文件夹

自行根据业务来调整懒加载策略。

懒加载组件(路由)写法
``` javascript
import DashboardIndex from 'Pages/dashboard/index'
{
    name: "index",
    path: "/",
    component:resolve => require(['Pages/index'], resolve), // 异步加载组件写法
    children: [{
        name: "dashboard",
        path: "dashboard",
        component: resolve => DashboardIndex                // 同步打包加载
    }]
}
```

### 模块的构成

当划分出一个子模块之后，我们不能简单粗暴的用一个 `.vue` 文件把所有业务逻辑完成，除非你的模块功能非常单一，其他的情况，我们希望把模块进行划分，由多个子 `component` 组成，划分的粒度也需要自己掌握，粒度越细越灵活，但也意味着 `component` 间的交互会变得复杂。

比如我们划分出了三个模块 `header`、`list`、`footer`，我们的目录结构按照上面的继续写就会是

``` javascript
	hosmanager
		hoslist
			index.vue
            store
                index.js
                actions.js
                modules
                    header.js
                    list.js
                    footer.js
            components
                header.vue
                list                // 如果业务非常复杂可做一下拆分
                    index.vue		// 参照 
                footer.vue
```

`hoslist/index.vue` 仅仅是作为组织文件，将三个子模块引入，并且做好架子的角色，如 `html` 中的布局，如果 `component` 间需要事件交互，这个文件也可以充当中介者的角色。

### 组件交互
兄弟组件

    父组件向子组件传递数据:
    props

    子组件向父组件抛出事件:
    vm.$emit('xxx')

    父组件用v-on:xxx="func"来接子组件触发的事件和暴露的数据

虽然vue还提供了`$ref`和`$parent`来让我们访问其他组件的数据和方法，但为了工程的可维护性，让我们的数据变化的追踪变得有规律可循，我们应尽量避免他们的使用

非兄弟组件
有时候非父子关系的组件也需要通信。在简单的场景下，使用一个空的 `Vue 实例作为中央事件总线`

业务简单:

    var bus = new Vue()

    // 触发组件 A 中的事件
    bus.$emit('id-selected', 1)

    // 在组件 B 创建的钩子中监听事件
    bus.$on('id-selected', (id) => {
    // ...
    })

业务复杂:

    请直接使用 Vuex



### `store` 使用（ `vuex` ）
#### 业务功能分散 

在通常的业务中，通常会把所有 `store` 都放到一个目录下，通过 `modules` 来拆分，现实很美好，科室后台系统这种业务，其实模块与模块之间的交互并不高，可以说是基本没有，所以随着业务的增长，`store` 下的对应的module越来越多，在 `store` 和 `pages` 中来回切换就非常耗时。

好在 `vuex@2.3.1 `之后添加了 `registerModule` 和 `unregisterModule` 2个方法，让我们能把 `store` 中的 `module` 分散到对应的业务当中。


使用都是跟着路由的生命周期完成的，这里并不是真正的把`store`移除，实质上只是在当前的`store`树上解除了引用关系，下来再次加回来的时候状态都还在。如果想要每次都是新的状态，应该在`state`的声明的时候返回一个纯函数，每次使用的时候都是新的状态。

就拿上面模块层级来举例：
`hoslist/store/index.js` 我们编写注册store的方法
```javascript
import store from 'Store'
import * as actions  from './actions'

import header from './modules/header'
import list from './modules/list'
import footer from './modules/footer'

export default {
    install(){
        store.registerModule(['hoslist'], {
            actions,
            modules: {
                header,
                list,
                footer
            },
            namespace: true
        })
    },
    uninstall(){
        store.unregisterModule(['hoslist']);
    }
}

```
``` javascript
// hoslist/index.vue 中
beforeRouteEnter(to, from, next) {
    store.install()
    next()
},
beforeRouteLeave(to, from, next) {
    store.uninstall()
    next()
}
```
`hoslist/index.vue` 中

``` javascript
// hoslist/index.vue 中
beforeRouteEnter(to, from, next) {
    store.install()
    next()
},
beforeRouteLeave(to, from, next) {
    store.uninstall()
    next()
}
```
这样我们就在业务中使用了。
```javascript
this.$store.commit('header/xxx')
this.$store.commit('list/xxx')
this.$store.commit('footer/xxx')

computed: {
    ...mapGetters('header', ['headerGetter1', 'headerGetter2'])
}

methods: {
    ...mapActions(['acton_methods'])
}
```


#### 业务功能集中
请把数据直接放在 `src/store` 下，用 `module` 来划分。

### `actions` 命名规范

由于项目中的 `store` 是合并到一个 `store` 上，获取 `actions` 的方式又是通过 `mapActions`，所以需要做好命名的区分。

一般我们是用，由于有命名空间，在多个模块间共用的`actions`不能重复:

    DO_something	GET_HOSLIST

### `getter` 命名规范

由于项目中的 `store` 是合并到一个 `store` 上，获取 `getter` 的方式又是通过 `mapGetters`，所以需要做好命名的区分

有了命名空间，一般是不会重复，一般我们是用:

	...mapGetters('tab', ['activeTab', 'showMask'])

### `pages` 文件夹下命名规范

原子命名和尽量全部都小写

比如有一个目录结构是：

    医院管理
        医院列表

对应的 `page` 下的文件目录结构就应该类似如下：

	hosmanage
		list

    //或者

    hosmanage
        hoslist

这样看起来会使整个目录整洁，尽量少的文件夹名，也会跟容易让人记得住。

